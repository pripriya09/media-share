import React from 'react'
import { Outlet } from 'react-router-dom'

function Display() {
  return (<>
    {/* <div>Display</div> */}
    <form action="post">
    <Outlet/>
    </form>

    </>)
}

export default Display