import React, { useState } from "react";
import "./autopost.css";
import { NavLink } from "react-router-dom";
import axios from "axios";
function AutoPostApp() {
  const [username, setUserName] = useState('');
  // const [email, setEmail] = useState();
  const [otp, setOtp] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false);
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
        setIsOtpVerified(true);
        setLoading(false);
        alert("OTP sent to your email. Please verify it.");
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

  const handleOtpVerification = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:8006/auth/verify-otp", {
        username,
        otp,
      });

      if (res.status === 200) {
        alert("OTP verified. Login successful.");
        window.location.href = "/home";
      }
    } catch (error) {
      alert("Invalid or expired OTP. Please try again.");
    }
  };

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

        {isOtpVerified && (
        <form onSubmit={handleOtpVerification}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            Verify OTP
          </button>
        </form>
      )}


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
