import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AutoPostApp from './AutoPostApp';
import SignIn from './SignIn';
import Home from './Home';
import Nesting from './Nesting';
import LogMedia from './LogMedia';
import CreatePost from './CreatePost';
import MyPost from './MyPost';
import AdminPanel from './AdminPanel';
import PrivateRoute from './PrivateRoute'; // Wrapper for authenticated routes

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<AutoPostApp />} />
        <Route path="/signin" element={<SignIn />} />

        {/* Protected Routes */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        >
          <Route index element={<Nesting />} />
          <Route path="loginmedia" element={<LogMedia />} />
          <Route path="createPost" element={<CreatePost />} />
          <Route path="myPost" element={<MyPost />} />
          <Route path="adminPanel" element={<AdminPanel />} />
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
