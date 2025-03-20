import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { DarkModeProvider } from "./contexts/DarkModeContext"
import Index from "./pages/Index"
import NotFound from "./pages/NotFound"
import ReviewPost from "./pages/ReviewPost"
import Community from "./pages/Community"
import Login from "./components/Login"
import ProtectedRoute from "./components/ProtectedRoute"
const queryClient = new QueryClient()

const App = () => (
  // <GoogleAuthProviderWrapper>
  <QueryClientProvider client={queryClient}>
    <DarkModeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              }
            />
            {/* <Route path="/home" element={<Index />} /> */}
            <Route path="/review-post" element={<ReviewPost />} />
            <Route path="/community" element={<Community />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </TooltipProvider>
    </DarkModeProvider>
  </QueryClientProvider>
)

export default App
