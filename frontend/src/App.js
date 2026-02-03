import React, { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Profile from "./components/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import { setAuthToken } from "./api/axios";
import PublicProfile from "./components/PublicProfile";

function App() {
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    // Just signal that auth check is done
    setAuthReady(true);
  }, []);

  if (!authReady) {
    return <p>Loading...</p>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/profile" element={
          <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/user/:id" element={<PublicProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;