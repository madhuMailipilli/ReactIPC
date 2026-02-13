import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./components/AuthContext";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleBasedRedirect from "./components/RoleBasedRedirect";
import AdminLayout from "./components/AdminLayout";
import AgentLayout from "./components/AgentLayout";
import VPLayout from "./components/VPLayout";
import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPasswordPage from "./pages/ResetPassword";
import About from "./pages/About";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import AgencyManagement from "./pages/admin/AgencyManagement";
import AddAgency from "./pages/admin/AddAgency";
import UserManagement from "./pages/admin/UserManagement";
import UserDetails from "./pages/admin/UserDetails";
import EditUser from "./pages/admin/EditUser";
import ResetPassword from "./pages/admin/ResetPassword";
import AddUser from "./pages/admin/AddUser";
import AdminReports from "./pages/admin/AdminReports";
import Profile from "./pages/admin/Profile";
import ChangePassword from "./pages/admin/ChangePassword";

import EditAgency from "./pages/admin/EditAgency";
import AgencyDetails from "./pages/admin/AgencyDetails";
import SubscriptionPlans from "./pages/admin/SubscriptionPlans";
import PlanForm from "./pages/admin/PlanForm";

// Agent Pages
import AgentDashboard from "./pages/agent/AgentDashboard";
import Document from "./pages/agent/Document";

// VP Pages
import VPDashboard from "./pages/vp/VPDashboard";
import VPAgentManagement from "./pages/vp/VPAgentManagement";
import VPAgentDetails from "./pages/vp/VPAgentDetails";
import VPAddAgent from "./pages/vp/VPAddAgent";
import VPEditAgent from "./pages/vp/VPEditAgent";

import "./index.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/auth/:id" element={<UserDetails />} />

          {/* Protected Admin Layout Route */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="SUPER_ADMIN">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="agency" element={<AgencyManagement />} />
            <Route path="agency/add" element={<AddAgency />} />
            <Route path="agency/view/:id" element={<AgencyDetails />} />
            <Route path="agency/edit/:id" element={<EditAgency />} />

            <Route path="user" element={<UserManagement />} />
            <Route path="user/view/id/:id" element={<UserDetails />} />
            <Route path="auth/:id" element={<UserDetails />} />
            <Route path="user/edit/:id" element={<EditUser />} />
            <Route
              path="user/reset-password/:username"
              element={<ResetPassword />}
            />
            <Route path="user/add" element={<AddUser />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="subscription/create-plan" element={<PlanForm />} />
            <Route path="subscription/plans" element={<SubscriptionPlans />} />
            <Route path="subscription/edit-plan/:id" element={<PlanForm />} />
            <Route path="profile" element={<Profile />} />
            <Route path="change-password" element={<ChangePassword />} />
          </Route>

          {/* Protected Agent Layout Route */}
          <Route
            path="/agent"
            element={
              <ProtectedRoute requiredRole="AGENT">
                <AgentLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AgentDashboard />} />
            <Route path="document" element={<Document />} />
            <Route path="profile" element={<Profile />} />
            <Route path="change-password" element={<ChangePassword />} />
          </Route>

          {/* Protected VP Layout Route */}
          <Route
            path="/vp"
            element={
              <ProtectedRoute requiredRole="VP">
                <VPLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<VPDashboard />} />
            <Route path="agent" element={<VPAgentManagement />} />
            <Route path="agent/view/id/:id" element={<VPAgentDetails />} />
            <Route path="agent/edit/:id" element={<VPEditAgent />} />
            <Route
              path="agent/reset-password/:username"
              element={<ResetPassword />}
            />
            <Route path="agent/add" element={<VPAddAgent />} />
            <Route path="profile" element={<Profile />} />
            <Route path="change-password" element={<ChangePassword />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
