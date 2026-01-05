import React, { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./index.css";
import FlotingShape from "./component/FlotingShape";
import SignUpPage from "./pages/SignUpPage";
import Login from "./pages/Login";
import Forgetpassword from "./pages/Forgotpassword";
import EmailVerification from "./pages/EmailVerification";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import Dashboard from "./pages/Dashboard";
import ResetPasswordPage from "./pages/ResetPasswordPage";

// import Home from "./pages/Home";

const ProtectRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (!user?.isVerified) {
    return <Navigate to="/verifyemail" replace />;
  }
  return children;
};

const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (isAuthenticated && user.isVerified) {
    return <Navigate to="/" replace></Navigate>;
  }
  return children;
};

const App = () => {
  const { isCheckingAuth, checkAuth, isAuthenticated, user } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  // console.log("isAuthenticated:", isAuthenticated);
  // console.log("user:", user);
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }
  return (
    <div
      className="
  min-h-screen bg-linear-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden
  "
    >
      <FlotingShape
        color="bg-green-500"
        size="w-64 h-64"
        top="-5%"
        left="10%"
        delay={0}
      />
      <FlotingShape
        color="bg-emerald-500"
        size="w-48 h-48"
        top="70%"
        left="80%"
        delay={5}
      />
      <FlotingShape
        color="bg-lime-500"
        size="w-32 h-32"
        top="40%"
        left="-10%"
        delay={2}
      />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectRoute>
                <Dashboard />
              </ProtectRoute>
            }
          />
          <Route
            path="signup"
            element={
              <RedirectAuthenticatedUser>
                <SignUpPage />
              </RedirectAuthenticatedUser>
            }
          />
          <Route
            path="/login"
            element={
              <RedirectAuthenticatedUser>
                <Login />
              </RedirectAuthenticatedUser>
            }
          />
          <Route
            path="/forgetpassword"
            element={
              <RedirectAuthenticatedUser>
                <Forgetpassword />
              </RedirectAuthenticatedUser>
            }
          />
          <Route
            path="/verifyemail"
            element={
              <RedirectAuthenticatedUser>
                <EmailVerification />
              </RedirectAuthenticatedUser>
            }
          />
          <Route path="/resetpassword/:token" element={<ResetPasswordPage />} />
          {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
};

export default App;
