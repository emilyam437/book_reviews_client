import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {AuthContext} from '../helpers/AuthContext';
import Navbar from './Navbar';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const {setAuthState} = useContext(AuthContext)
  const [authState, setAuthState2] = useState({username: "", id:0, status: false});
  const [showPassword, setShowPassword] = useState(false);
  const [buttonShow, setButtonShow] = useState(true);

  let history = useNavigate();

  const login = () => {
    const data = { username: username, password: password };
    axios.post("http://localhost:3001/auth/login", data).then((response) => {
      if (!response.data.error) {
        localStorage.setItem("accessToken", response.data.token);
        setAuthState2({username: response.data.username, id:response.data.id, status: true});
        setAuthState({username: response.data.username, id:response.data.id, status: true});
        history(`/home`);
      } else {
        alert('Wrong password or username')
      }
    });
  };

  const toggleButtons = () => {
    setShowPassword(!showPassword);
    setButtonShow(!buttonShow);
  }

  return (
    <div>
 {authState.status && <Navbar/>} 
   
    <div className="loginContainer">
      <h2>Login</h2>
      <br/>
      <label>Username:&nbsp;</label>
      <input
        type="text"
        onChange={(event) => {
          setUsername(event.target.value);
        }}
      />
      <label>&nbsp;&nbsp;Password:&nbsp;</label>
      <input
        type={showPassword ? "text" : "password"}
        onChange={(event) => {
          setPassword(event.target.value);
        }}
      />
{buttonShow ? 
        (<span className="eyeCont">&nbsp;<VisibilityIcon className="eye" onClick={toggleButtons} fontSize="small"/>&nbsp;</span>) : 
        (<span className="eyeCont">&nbsp;<VisibilityOffIcon className="eye" onClick={toggleButtons} fontSize="small"/>&nbsp;</span>)}
      <button onClick={login}> Login </button>
    </div>
    <div className="registerButtonCont">
    <h4>New User? <strong className="loginClick" onClick={()=>{history('/register')}}>Click here</strong> to create a new account</h4> 
    </div>
    </div>
  );
}

export default Login;


// import React, {useEffect, useState} from 'react'
// import {useParams, useNavigate} from 'react-router-dom';
// import axios from 'axios';
// import {BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';



// function Login() {

//     const [user, setUser] = useState("");
//     const [newPassword, setNewPassword] = useState("");

//     let history = useNavigate();

//     const loginAuth = () => {
//        // alert('you clicked the login button')
//         const data = { username: user,
//                 password: newPassword }
//              //   alert(`${data.username} is logging in`)
//         axios.post(`http://localhost:3001/auth/login`, data).then((res)=>{
//           if (res.data.error) {alert(res.data.error)}
//           else {
//             localStorage.setItem("accessToken", res.data)
//           history('/')
//           }
//           })
//       }
//   return (
//     <div>
//         <p>Login</p> 
//         <form className="addCommentContainer">
//       <input type="text" placeholder="Username" className='inputSubmit' value={user} autoComplete="username"
//             onChange={(event)=> {
//               setUser(event.target.value)
//             }}/>
//           <input type="password" placeholder="Password" className='inputSubmit' value={newPassword} autoComplete="current-password"
//             onChange={(event)=> {
//               setNewPassword(event.target.value)
//             }}/>
//       <br/>
//       <button className='submitButton2' onClick={loginAuth}>Submit</button>
// </form>
//         <h3>New User? Click below to create a new account</h3> 
//         <Link to='/register'><button>Create Account</button></Link>
//     </div>
//   )
// }

// export default Login