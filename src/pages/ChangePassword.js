import React, { useState } from 'react';
import Navbar from './Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

function ChangePassword() {  
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false);
  const [buttonShow, setButtonShow] = useState(true);
  const [showPassword2, setShowPassword2] = useState(false);
  const [buttonShow2, setButtonShow2] = useState(true);
  const history = useNavigate();

  const changePassword = () => {
    let answer = window.confirm('Save new password?')
    if (answer) {
      axios.put(`http://localhost:3001/auth/changepassword/`,  { oldPassword: oldPassword, newPassword: newPassword}, 
               { headers: { accessToken: localStorage.getItem("accessToken")} } ).then((response) => {
                if (response.data.error) {alert(response.data.error)}
                else {
                  history(`/login`)
                }
              }) }
  }

  const toggleButtons = () => {
    setShowPassword(!showPassword);
    setButtonShow(!buttonShow);
  }
  const toggleButtons2 = () => {
    setShowPassword2(!showPassword2);
    setButtonShow2(!buttonShow2);
  }
  return (
    <div>
      <Navbar/>
        <h1>Change Your Password</h1>
    <input type={showPassword ? "text" : "password"} placeholder="current password" onChange={(e)=>{setOldPassword(e.target.value)}}/>
    {buttonShow ? 
    (<span className="eyeCont">&nbsp;<VisibilityIcon className="eye" onClick={toggleButtons} fontSize="small"/>&nbsp;</span>) : 
    (<span className="eyeCont">&nbsp;<VisibilityOffIcon className="eye" onClick={toggleButtons} fontSize="small"/>&nbsp;</span>)}
    <input type={showPassword2 ? "text" : "password"}  placeholder="new password" onChange={(e)=>{setNewPassword(e.target.value)}}/>
    {buttonShow2 ? 
    (<span className="eyeCont">&nbsp;<VisibilityIcon className="eye" onClick={toggleButtons2} fontSize="small"/>&nbsp;</span>) : 
    (<span className="eyeCont">&nbsp;<VisibilityOffIcon className="eye" onClick={toggleButtons2} fontSize="small"/>&nbsp;</span>)}
    <br/>
    <button onClick={changePassword}>Save Changes</button>
    </div>
  )
}

export default ChangePassword