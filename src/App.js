import './App.css';
import {BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import Post from './pages/Post';
import Login from './pages/Login';
import CreateAccount from './pages/CreateAccount';
import {AuthContext} from './helpers/AuthContext';
import {useState, useEffect} from 'react';
import axios from 'axios';
import ErrorPage from './pages/ErrorPage';
import Navbar from './pages/Navbar';
import ChangePassword from './pages/ChangePassword';
import Profile from './pages/profile';
import EditPost from './pages/EditPost';

function App() {

  const [authState, setAuthState] = useState({username: "", id:0, status: false});

  useEffect(()=>{
    axios.get('https://book-review-posts.herokuapp.com/auth/auth', { headers: {
      accessToken: localStorage.getItem('accessToken')
    }}).then((response)=>{
      if (response.data.error) {setAuthState({username: "", id:0, status: false})}
      else {
        if (localStorage.getItem('accessToken')) {
          setAuthState({username: response.data.username, id:response.data.id, status: true})
        }
      }
    })
  }, [])

  return (
    <div className="App">
      <AuthContext.Provider value={{authState, setAuthState}}>
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/home' element={<Home />} />
          <Route path='/createpost' element={<CreatePost />} /> 
          <Route path='/post/:id' element={<Post />} />
          <Route path='/login' element={<Login />} /> 
          <Route path='/register' element={<CreateAccount />}></Route>
          <Route path='/profile/:user' element={<Profile/>}></Route>
          <Route path='/navbar' element={<Navbar/>}></Route>
          <Route path='/change-password' element={<ChangePassword/>}></Route>
          <Route path='/edit-post/:id' element={<EditPost/>}></Route>
          <Route path="*" element={<ErrorPage/>} />
        </Routes>
      </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
