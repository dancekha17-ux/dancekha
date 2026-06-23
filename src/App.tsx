import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import InstructorProfile from "./pages/InstructorProfile";
import GlobalStyles from "./pages/GlobalStyles";
import CourseDetail from "./pages/CourseDetail";
import TeacherAuth from "./pages/TeacherAuth";
import TeacherDashboard from "./pages/TeacherDashboard";
import TeacherPreview from "./pages/TeacherPreview";
import TeacherRecruit from "./pages/TeacherRecruit";
import Dashboard from "./pages/Dashboard";
import MasterDashboard from "./pages/MasterDashboard";
import EventDetail from "./pages/EventDetail";
import AdminDashboard from "./pages/AdminDashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AgreementPage from "./pages/AgreementPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/instructors/:slug" element={<InstructorProfile />} />
            <Route path="/styles" element={<GlobalStyles />} />
            <Route path="/course-detail/:id" element={<CourseDetail />} />
            <Route path="/teacher/login" element={<TeacherAuth />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
            <Route path="/teacher/agreement" element={<AgreementPage />} />
            <Route path="/teacher/preview" element={<TeacherPreview />} />
            <Route path="/register" element={<TeacherRecruit />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/master-dashboard" element={<MasterDashboard />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
