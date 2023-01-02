import React, {useState, useEffect, useContext } from 'react'
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import axios from "axios";
import {useNavigate} from'react-router-dom';
import Navbar from './Navbar';
import {AuthContext} from '../helpers/AuthContext';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

function CreateAccount() {

  let history = useNavigate();

  const [listOfUsers, setListOfUsers] = useState([]);
  const [listOfNames, setListOfNames] = useState([]);
  const {setAuthState} = useContext(AuthContext)
  const [authState, setAuthState2] = useState({username: "", id:0, status: false});
  const [showPassword, setShowPassword] = useState(false);
  const [buttonShow, setButtonShow] = useState(true);

  const initialValues = {
    username:"",
     password:""
  }

  useEffect(()=>{
    axios.get("https://book-review-posts.herokuapp.com/auth/all-users"
    ).then((res)=>{
      setListOfUsers(res.data);
      let newArr = []
      listOfUsers.map((value, key)=>{
        newArr.push(value.username);
      })
      setListOfNames(newArr);
    })
  }, [])

  const onSubmit = (data) => {
    axios.get("https://book-review-posts.herokuapp.com/auth/all-users"
    ).then((res)=>{
      setListOfUsers(res.data);
      let newArr = []
      listOfUsers.map((value, key)=>{
        newArr.push(value.username.toLowerCase());
      })
      setListOfNames(newArr);
      if (newArr.includes(data.username.toLowerCase())){
        alert('This username already exists. Try another.')
      } else {
        axios.post("https://book-review-posts.herokuapp.com/auth", data).then((res)=>{
          history('/login')
        })
      }
    })}

  const validationSchema = Yup.object().shape({
    username: Yup.string().min(3).max(30).required("username must be between 3 and 30 characters"),
    password: Yup.string().min(3).max(30).required("Enter password")
  });
  const toggleButtons = () => {
    setShowPassword(!showPassword);
    setButtonShow(!buttonShow);
  };

  return (
    <div>
{authState.status && <Navbar/>} 
    <div className="createPostPage">
      <h2>Create New Account</h2>
      <br/>
        <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
            <Form>
                <label>Username: </label>
                <ErrorMessage name="username" component="span"/>
                <Field className="inputCreatePost" name="username" placeholder="Enter username"/>
                <label>&nbsp; Password: </label>
                <ErrorMessage name="password" component="span"/>
                <Field className="inputCreatePost" name="password" placeholder="Enter password" 
                autoComplete="off" type={showPassword ? "text" : "password"}/> 
                <span className="eyeCont2">{buttonShow ? 
                  (<span className="eyeCont">&nbsp;<VisibilityIcon className="eye" onClick={toggleButtons} fontSize="small"/>&nbsp;</span>) : 
                  (<span className="eyeCont">&nbsp;<VisibilityOffIcon className="eye" onClick={toggleButtons} fontSize="small"/>&nbsp;</span>)}</span>
                <button type='submit' className="submitButton">Submit</button>
            </Form>
        </Formik>
        <br/>
        <h4>Have an account? <strong className="loginClick" onClick={()=>{history('/login')}}>Click here</strong> to log in</h4>
    </div>
    
    </div>
  )
}

export default CreateAccount;
