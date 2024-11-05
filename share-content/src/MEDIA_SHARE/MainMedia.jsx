import React from 'react'
import { NavLink } from 'react-router-dom';

function MainMedia() {
  return (
    <div>
       <NavLink to='/home'>
       <button>share</button>
       </NavLink>
    </div>
  )
}

export default MainMedia