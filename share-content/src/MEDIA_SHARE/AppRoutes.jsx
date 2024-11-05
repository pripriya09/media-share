import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AutoPostApp from './AutoPostApp';
import SignIn from './SignIn';
import Home from './Home';
import Nesting from './Nesting';
import CreatePost from './CreatePost';
import MyPost from './MyPost';
import AdminPanel from './AdminPanel';





function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AutoPostApp/>} />  
        <Route path="/signin" element={<SignIn/>} />   
     <Route path="/home" element={<Home/>}>
        <Route index element={<Nesting/>} />
        <Route path="createPost" element={<CreatePost/>} />
        <Route path="myPost" element={<MyPost/>} />
        <Route path="adminPanel" element={<AdminPanel/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
