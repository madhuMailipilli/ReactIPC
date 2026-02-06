const express = require("express");
const mysql = require("mysql2/promise");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");
const fs = require("fs");
const axios = require("axios");
const PDFDocument = require("pdfkit");
const nodemailer = require("nodemailer");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");


const app = express();

/* ================= MIDDLEWARE ================= */
app.use(cors({
  origin: ['http://localhost:8000'],
  credentials: true
}));
app.use(express.json());

app.get('/test', (req, res) => {
  res.json({ message: 'Server is running' });
});

/* ================= CONFIG ================= */
const DB_NAME = "insurance_policy_app";
const JWT_SECRET = "SUPER_SECRET_KEY";

const DEFAULT_ADMIN = {
  tenantName: "Default Tenant",
  email: "admin@system.com",
  password: "Admin@123",
  role: "TENANT_ADMIN"
};

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "root",
  multipleStatements: true
};

let db;

/* ================= DB INIT ================= */
async function initDB() {
  try {
    const conn = await mysql.createConnection(dbConfig);
    await conn.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`);
    await conn.query(`USE ${DB_NAME}`);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS tenants (
        id CHAR(36) PRIMARY KEY,
        name VARCHAR(200)
      );

      CREATE TABLE IF NOT EXISTS agencies (
        id CHAR(36) PRIMARY KEY,
        tenant_id CHAR(36),
        name VARCHAR(200)
      );

      CREATE TABLE IF NOT EXISTS users (
        id CHAR(36) PRIMARY KEY,
        tenant_id CHAR(36),
        agency_id CHAR(36),
        role ENUM('TENANT_ADMIN','VP','AGENT'),
        email VARCHAR(200),
        password_hash TEXT,

        vp_agency_id CHAR(36) GENERATED ALWAYS AS (
          CASE WHEN role='VP' THEN agency_id ELSE NULL END
        ) STORED,

        UNIQUE INDEX ux_one_vp_per_agency (vp_agency_id)
      );

      CREATE TABLE IF NOT EXISTS business_rules (
        id CHAR(36) PRIMARY KEY,
        tenant_id CHAR(36),
        agency_id CHAR(36),
        field_name VARCHAR(100),
        rule_type VARCHAR(50)
      );

      CREATE TABLE IF NOT EXISTS reports (
        id CHAR(36) PRIMARY KEY,
        agent_id CHAR(36),
        status VARCHAR(50),
        pdf_path TEXT
      );
    `);

    db = await mysql.createPool({ ...dbConfig, database: DB_NAME });
    await createDefaultAdmin();
    console.log("✅ Database ready");
  } catch (err) {
    console.error("⚠️ DB error, running in mock mode:", err.message);
  }
}

/* ================= DEFAULT ADMIN ================= */
async function createDefaultAdmin() {
  if (!db) return;

  const [[tenant]] = await db.query("SELECT * FROM tenants LIMIT 1");
  let tenantId = tenant?.id || uuidv4();

  if (!tenant) {
    await db.query("INSERT INTO tenants VALUES (?,?)", [
      tenantId,
      DEFAULT_ADMIN.tenantName
    ]);
  }

  const [[admin]] = await db.query(
    "SELECT * FROM users WHERE role='TENANT_ADMIN' LIMIT 1"
  );

  if (!admin) {
    const hash = bcrypt.hashSync(DEFAULT_ADMIN.password, 10);
    await db.query(
      "INSERT INTO users (id,tenant_id,agency_id,role,email,password_hash) VALUES (?,?,?,?,?,?)",
      [uuidv4(), tenantId, null, DEFAULT_ADMIN.role, DEFAULT_ADMIN.email, hash]
    );
    console.log("🔐 Default login:", DEFAULT_ADMIN.email, "/", DEFAULT_ADMIN.password);
  }
}

/* ================= AUTH ================= */
function auth(roles = []) {
  return (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      const user = jwt.verify(token, JWT_SECRET);
      if (roles.length && !roles.includes(user.role))
        return res.sendStatus(403);
      req.user = user;
      next();
    } catch {
      res.sendStatus(401);
    }
  };
}

/* ================= LOGIN ================= */
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (db) {
    const [[user]] = await db.query("SELECT * FROM users WHERE email=?", [email]);
    if (user && bcrypt.compareSync(password, user.password_hash)) {
      return res.json({ token: jwt.sign(user, JWT_SECRET) });
    }
  } else {
    if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
      return res.json({
        token: jwt.sign(
          { role: "TENANT_ADMIN", tenant_id: "mock" },
          JWT_SECRET
        )
      });
    }
  }

  res.status(401).json({ error: "Invalid login" });
});

/* ================= TENANTS CRUD ================= */
app.get("/tenants", auth(["TENANT_ADMIN"]), async (_, res) => {
  const [rows] = db ? await db.query("SELECT * FROM tenants") : [[]];
  res.json(rows);
});

app.post("/tenants", auth(["TENANT_ADMIN"]), async (req, res) => {
  await db?.query("INSERT INTO tenants VALUES (?,?)", [uuidv4(), req.body.name]);
  res.json({ status: "CREATED" });
});

/* ================= AGENCIES ================= */
app.get("/tenants/:tenantId/agencies", auth(["TENANT_ADMIN"]), async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM agencies WHERE tenant_id=?",
    [req.params.tenantId]
  );
  res.json(rows);
});

app.post("/agencies", auth(["TENANT_ADMIN"]), async (req, res) => {
  await db.query("INSERT INTO agencies VALUES (?,?,?)", [
    uuidv4(),
    req.user.tenant_id,
    req.body.name
  ]);
  res.json({ status: "CREATED" });
});

/* ================= USERS ================= */
app.post("/agencies/:agencyId/users", auth(["TENANT_ADMIN","VP"]), async (req, res) => {
  const { agencyId } = req.params;
  const { email, password, role } = req.body;

  if (!["VP","AGENT"].includes(role))
    return res.status(400).json({ error: "Invalid role" });

  if (req.user.role === "VP" && role === "VP")
    return res.status(403).json({ error: "VP cannot create VP" });

  if (req.user.role === "VP" && req.user.agency_id !== agencyId)
    return res.status(403).json({ error: "Cross-agency denied" });

  try {
    const hash = bcrypt.hashSync(password, 10);
    await db.query(
      "INSERT INTO users (id,tenant_id,agency_id,role,email,password_hash) VALUES (?,?,?,?,?,?)",
      [uuidv4(), req.user.tenant_id, agencyId, role, email, hash]
    );
    res.json({ status: "USER_CREATED" });
  } catch (e) {
    if (e.code === "ER_DUP_ENTRY")
      return res.status(409).json({ error: "Only one VP per agency" });
    res.status(500).json({ error: e.message });
  }
});

/* ================= BUSINESS RULES ================= */
app.get("/rules/:agencyId", auth(["VP"]), async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM business_rules WHERE agency_id=?",
    [req.params.agencyId]
  );
  res.json(rows);
});

app.post("/rules", auth(["VP"]), async (req, res) => {
  await db.query("INSERT INTO business_rules VALUES (?,?,?,?,?)", [
    uuidv4(),
    req.user.tenant_id,
    req.user.agency_id,
    req.body.field_name,
    req.body.rule_type
  ]);
  res.json({ status: "CREATED" });
});

/* ================= AI + PDF + EMAIL ================= */
function applyRules(extracted, rules) {
  return rules.map(r => ({
    field: r.field_name,
    result: extracted[r.field_name] ? "PASS" : "FAIL"
  }));
}

function generatePDF(id, results) {
  const doc = new PDFDocument();
  const path = `./report_${id}.pdf`;
  doc.pipe(fs.createWriteStream(path));
  doc.text("Insurance Policy Report");
  results.forEach(r => doc.text(`${r.field}: ${r.result}`));
  doc.end();
  return path;
}

const mailer = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: { user: "your@gmail.com", pass: "app-password" }
});

app.post("/process", auth(["AGENT"]), async (req, res) => {
  const extracted = {}; // placeholder AI
  const [rules] = await db.query(
    "SELECT * FROM business_rules WHERE agency_id=?",
    [req.user.agency_id]
  );

  const results = applyRules(extracted, rules);
  const reportId = uuidv4();
  const pdf = generatePDF(reportId, results);

  await db.query("INSERT INTO reports VALUES (?,?,?,?)", [
    reportId,
    req.user.id,
    "COMPLETED",
    pdf
  ]);

  res.json({ reportId, status: "COMPLETED" });
});

/* ================= DASHBOARD ================= */
app.get("/admin/dashboard", auth(["TENANT_ADMIN"]), async (_, res) => {
  const [[u]] = await db.query("SELECT COUNT(*) c FROM users");
  const [[r]] = await db.query("SELECT COUNT(*) c FROM reports");
  res.json({ users: u.c, reports: r.c });
});

/* ================= SWAGGER ================= */
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* ================= START ================= */
initDB().then(() => {
  app.listen(3000, () => {
    console.log("🚀 Server running on http://localhost:3000");
    console.log("📘 Swagger http://localhost:3000/swagger");
  });
});
