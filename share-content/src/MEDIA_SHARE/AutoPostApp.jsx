import React, { useState } from "react";
import "./autopost.css";
import { NavLink } from "react-router-dom";
import axios from "axios";
function AutoPostApp() {
  const [username, setUserName] = useState('');
  // const [email, setEmail] = useState();
  const [isUpdateRegister, setIsUpdateRegister] = useState(null);
  const [password,setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!username || !password) {
      setIsUpdateRegister("Username and password are required");
      alert("Username and password are required")
      return;
    }
 setLoading(true); 
    e.preventDefault();
    axios.post("http://localhost:8006/auth/login", {
      username,
      password
    })
    .then((res) => {
      if (res.data) {
        setLoading(false);
        window.location.href = "/home";
      } else {
        setIsUpdateRegister("Invalid username/password");
      }
    })
    .catch((error) => {
      setLoading(false); 
      console.error("Error during login:", error);
      setIsUpdateRegister("Internal Server Error");
      alert("this user is not valid please have a account and login")
    });
  }
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "20px",
          fontSize: "24px", 
        }}
      >
        WELCOME TO AUTOPOST/SHARE
      </div>

      <div className="SIGN-UP">
        <h2>lOGIN</h2>
        <form  onSubmit={handleSubmit}>
          <div className="formlogin">
            <input
              type="text"
              id="username"
              name="username"
              placeholder="username"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          {/* <div className="formlogin">
            <input
              type="email"
              id="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div> */}
          <div className="formlogin">
            <input
              type="password"
              id="password"
              placeholder="Enter password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="formlogin">
        
        <button type='submit' disabled={loading}>
          {loading ? 'Logging in...' : 'Submit'}
        </button>

          {/* <NavLink to="/share" > */}
          {/* <button type="submit" >Submit</button> */}
          {/* </NavLink> */}
          </div>
        </form>   
      {isUpdateRegister && <p>{isUpdateRegister}</p>}
        <div className="creatNew">
            <NavLink to="/signin">
        <button className="newAccount">Create New Account</button>
        </NavLink>
      </div>
      </div>


    </>
  );
}

export default AutoPostApp;
