import React from 'react'
import {Link} from 'react-router-dom';
import {AuthContext} from '../helpers/AuthContext';
import {useState, useEffect} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

function Navbar() {
    const [authState, setAuthState] = useState({username: "", id:0, status: false});

    const history = useNavigate();

    const logout = () => {
        localStorage.removeItem("accessToken");
        setAuthState(false)
        history('/login')
      }

    useEffect(()=>{
        axios.get('http://localhost:3001/auth/auth', { headers: {
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
    // <AuthContext.Provider value={{authState, setAuthState}}>
<div className="navBarCont">
      <Link to='/home'><p className='navItem'>Home</p></Link>
      <Link to='/createpost'><p className='navItem'>Post Review</p></Link>
{authState.status && (<p className='navItem' onClick={()=> {history(`/profile/${authState.username}`)}}>My Profile</p>)}
{!authState.status ? (
<Link to='/login'><p className='navItem'>Login</p></Link>
    ) : (
        <p onClick={logout} className='navItem'>Logout</p>
)}
    {authState.status && (<p onClick={()=>{history(`/profile/${authState.username}`)}} className="navName">{authState.username}</p>)}
    </div>
    // </AuthContext.Provider>
  )
}

export default Navbar