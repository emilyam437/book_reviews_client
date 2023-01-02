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
    axios.post("https://book-review-posts.herokuapp.com/auth/login", data).then((response) => {
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