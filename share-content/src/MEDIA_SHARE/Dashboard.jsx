import React from 'react'

import { NavLink } from 'react-router-dom';

function Dashboard() {
  return (<>
    {/* <div>Dashboard</div> */}
    <div className="option">
    <ul>
        <li><NavLink to="loginmedia">LogMedia</NavLink></li>
      </ul>
      
    <ul>
        <li><NavLink to="createPost">CreatePost</NavLink></li>
      </ul>
      <ul>
        <li><NavLink to="myPost">MyPost</NavLink></li>
      </ul>
      <ul>
        <li><NavLink to="adminPanel">AdminPanel</NavLink></li>
      </ul>
    </div>

    </>)
}

export default Dashboard