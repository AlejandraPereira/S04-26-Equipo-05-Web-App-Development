import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "../../pages/home/Home"
import Login from "../../pages/auth/login/Login"
import Register from "../../pages/auth/register/Register"
import AuthLayout from "../../pages/auth/AuthLayout"
import Diagnostic from "../../pages/diagnostic/Diagnostic"
import Results from "../../pages/diagnostic/Results"
import MyProfile from "../../pages/profile/MyProfile"
import Marketplace from "../../pages/marketplace/Marketplace"
import Candidates from "../../pages/company/Candidates"
import JobOffers from "../../pages/company/JobOffers"
import CompanyProfile from "../../pages/company/CompanyProfile"
import Dashboard from "../../pages/dashboard/Dashboard"
import Learning from "../../pages/learning/Learning"
import CoursePage from "../../pages/learning/CoursePage"
import QuizPage from "../../pages/learning/QuizPage"

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route path="/diagnostic" element={<Diagnostic />} />
        <Route path="/results" element={<Results />} />
        <Route path="/profile" element={<MyProfile />} />
    
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/learning" element={<Learning />} />
        <Route path="/curso/:id" element={<CoursePage />} />
        <Route path="/course/:courseId/quiz/:quizId" element={<QuizPage />} />
        <Route path="/candidates" element={<Candidates />} />
        <Route path="/joboffers" element={<JobOffers />} />
        <Route path="/companyprofile" element={<CompanyProfile />} />
      

      </Routes>
    </BrowserRouter>
  )
}