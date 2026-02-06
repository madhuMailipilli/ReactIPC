# IPCR React Design

This is a React version of the Insurance Policy Check admin interface, converted from the Next.js project.

## Features

- **Admin Dashboard** with sidebar navigation
- **Agency Management** page
- **VP Management** page  
- **Agent Management** page
- **Reports** page
- **Responsive Design** with Tailwind CSS
- **React Router** for navigation

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/
│   └── AdminLayout.jsx     # Main layout with sidebar
├── pages/
│   ├── Dashboard.jsx       # Dashboard page
│   ├── AgencyManagement.jsx
│   ├── VPManagement.jsx
│   ├── AgentManagement.jsx
│   └── Reports.jsx
├── App.jsx                 # Main app with routing
├── main.jsx               # Entry point
└── index.css              # Tailwind styles
```

## Navigation

- `/admin` - Dashboard
- `/admin/agency` - Agency Management
- `/admin/vp` - VP Management  
- `/admin/agent` - Agent Management
- `/admin/reports` - Reports

The design matches the original Next.js version with the same styling and layout.