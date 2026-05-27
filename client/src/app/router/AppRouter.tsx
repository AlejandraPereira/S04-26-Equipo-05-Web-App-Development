import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../../pages/home/Home";
import Login from "../../pages/auth/login/Login";
import Register from "../../pages/auth/register/Register";
import AuthLayout from "../../pages/auth/AuthLayout";
import Diagnostic from "../../pages/diagnostic/Diagnostic";
import Results from "../../pages/diagnostic/Results";
import MyProfile from "../../pages/profile/MyProfile";
import Marketplace from "../../pages/marketplace/Marketplace";
import Candidates from "../../pages/company/Candidates";
import JobOffers from "../../pages/company/JobOffers";
import CompanyProfile from "../../pages/company/CompanyProfile";
import Dashboard from "../../pages/dashboard/Dashboard";
import Learning from "../../pages/learning/Learning";
import CoursePage from "../../pages/learning/CoursePage";
import QuizPage from "../../pages/learning/QuizPage";
import AuthCallback from "../../pages/auth/callback/AuthCallback";
import ForgotPassword from "../../pages/auth/forgot-password/ForgotPassword";
import ResetPassword from "../../pages/auth/reset-password/ResetPassword";
import SelectRole from "../../pages/auth/select-role/SelectRole";
import PublicProfile from "../../pages/profile/PublicProfile";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/select-role" element={<SelectRole />} />
        <Route path="/perfil/:userId" element={<PublicProfile />} />

        {/* Rutas protegidas — profesional */}
        <Route path="/diagnostic" element={<ProtectedRoute><Diagnostic /></ProtectedRoute>} />
        <Route path="/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><MyProfile /></ProtectedRoute>} />
        <Route path="/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
        <Route path="/learning" element={<ProtectedRoute><Learning /></ProtectedRoute>} />
        <Route path="/curso/:id" element={<ProtectedRoute><CoursePage /></ProtectedRoute>} />
        <Route path="/quiz/:courseId" element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />

        {/* Rutas protegidas — empresa */}
        <Route path="/companyprofile" element={<ProtectedRoute><CompanyProfile /></ProtectedRoute>} />
        <Route path="/joboffers" element={<ProtectedRoute><JobOffers /></ProtectedRoute>} />
        <Route path="/candidates" element={<ProtectedRoute><Candidates /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
