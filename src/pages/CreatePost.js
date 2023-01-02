import React, {useContext} from 'react'
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import axios from "axios";
import {useNavigate} from'react-router-dom';
import Navbar from './Navbar';
import {AuthContext} from '../helpers/AuthContext';

function CreatePost() {

  let history = useNavigate();

  const {authState} = useContext(AuthContext);

  const initialValues = {
    title:"",
    postMessage:"",
    username:""
  }

  const onSubmit = (data) => {
    axios.post("https://book-review-posts.herokuapp.com/posts",
    {
      title: data.title,
      postMessage: data.postMessage,
    },
    { headers: {
      accessToken: localStorage.getItem("accessToken"),
    },
  } ).then((response) => {
    if (response.data.error) {
      console.log(response.data.error);
    } else {
      const postToAdd = { title: data.title,
        postMessage: data.postMessage,
        username: response.data.username
    };
      history('/')
    }
  });
  }

  const validationSchema = Yup.object().shape({
    title: Yup.string().min(2).max(100).required("Title required in post"),
    postMessage: Yup.string().min(2).max(100).required("Please enter your post"),
  })

  return (
    <div className="createPostPage">
      <Navbar/>
      {!authState.status ? 
      (<div className="notLoggedIn"><h1>Please login or create an account to see content</h1>
      <br/>
      <button onClick={()=>{history('/login')}}>Login / Register</button></div>)  
      : (
        <Formik 
        initialValues={initialValues} 
        onSubmit={onSubmit} 
        validationSchema={validationSchema}
        validateOnChange={false}
        validateOnBlur={false}
        >
            <Form>
              <br/>
                <label className="label1">Title</label>
                <br/>
                <ErrorMessage name="title" component="span"/>
                <Field className="inputCreatePost" name="title" placeholder="Enter post title"/>
                <br />
                <label>Post</label>
                <br/>
                <ErrorMessage name="postMessage" component="span"/>
                <Field className="inputCreatePost" name="postMessage" placeholder="Enter your post" autoComplete="off"/>
                <br/>
                <button type='submit' className="submitButton">Submit Post</button>
            </Form>
        </Formik> ) }
    
    </div>
  )
}

export default CreatePost