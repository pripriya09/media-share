import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AutoPostApp from './AutoPostApp';
import SignIn from '../SignIn';
import Share from './Share';


function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AutoPostApp/>} />  
        <Route path="/signin" element={<SignIn/>} />  
        <Route path="/share" element={<Share/>} />  
        
     
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
