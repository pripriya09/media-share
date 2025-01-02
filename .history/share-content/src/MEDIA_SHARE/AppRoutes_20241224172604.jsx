import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Home';
import LogMedia from './LogMedia';
import CreatePost from './CreatePost';
import MyPost from './MyPost';
import AdminPanel from './AdminPanel';
import Display from './Display';
import Nesting from './Nesting';

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route index element={<Nesting />} />
          <Route path="loginmedia" element={<LogMedia />} />
          <Route path="createPost" element={<CreatePost />} />
          <Route path="myPost" element={<MyPost />} />
          <Route path="adminPanel" element={<AdminPanel />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
