import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "../../pages/home/Home"
import Login from "../../pages/auth/login/Login"
import Register from "../../pages/auth/register/Register"
import AuthLayout from "../../pages/auth/authLayout/AuthLayout"
import Diagnostic from "../../pages/assessment/diagnostic/Diagnostic"
import Results from "../../pages/assessment/results/Results"
import MyProfile from "../../pages/profile/MyProfile"
import Marketplace from "../../pages/marketplace/Marketplace"
import Candidates from "../../pages/company/candidates/Candidates"
import JobOffers from "../../pages/company/jobOffers/JobOffers"
import CompanyProfile from "../../pages/company/companyProfile/CompanyProfile"
import Dashboard from "../../pages/dashboard/Dashboard"
import Learning from "../../pages/education/learning/Learning"
import CoursePage from "../../pages/education/courses/CoursePage"
import QuizPage from "../../pages/education/quiz/QuizPage"

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