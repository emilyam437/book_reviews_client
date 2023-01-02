import React, {useEffect, useState, useContext} from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {AuthContext} from '../helpers/AuthContext';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import Navbar from './Navbar';
import ContentEditable from 'react-contenteditable'

function Profile() {

const location = useLocation();
let {user} = useParams();
const [currentUser, setCurrentUser] = useState("");
const [listOfPosts, setListOfPosts] = useState([]);
const {authState} = useContext(AuthContext);
const history = useNavigate();
const [newAboutMe, setNewAboutMe] = useState("");
const [showButton, setShowButton]= useState(false);
const [likedPosts, setLikedPosts] = useState([]);

useEffect(() => {
  axios.get(`https://book-review-posts.herokuapp.com/auth/userinfo/${user}`).then((response) => {
    setCurrentUser(response.data);
    });
  axios.get(`https://book-review-posts.herokuapp.com/posts/${user}`,{ headers: {accessToken: localStorage.getItem("accessToken")}
    }).then((res)=>{
  setListOfPosts(res.data.postList)
  setLikedPosts(res.data.likedPosts.map((like)=>{
    return like.UserPostId
  }))
});
axios.get(`https://book-review-posts.herokuapp.com/auth/${user}`).then((response) => {
  setNewAboutMe(response.data['aboutMe'])
})
}, [location.pathname]);

const changeAboutMe = () => {
  axios.put(`https://book-review-posts.herokuapp.com/auth/add-info/${user}`,  { "aboutMe": newAboutMe }, 
           { headers: { accessToken: localStorage.getItem("accessToken") },
          } ).then(() => {
             setShowButton(false);
          })}

const updateAboutMe = (info) => {
  setNewAboutMe(info);
  setShowButton(true);
}
    
const deletePost = (id) => {
    let answer = window.confirm('Delete Post?')
    if (answer) {
    if (!id) {
      alert('please refresh the page and try again')
    } else {
     axios.delete(`https://book-review-posts.herokuapp.com/posts/${id}`, { headers: {
      accessToken: localStorage.getItem("accessToken"),
     },
   } ).then(() => {
       setListOfPosts(listOfPosts.filter((val)=>{
           return val.id !== id
      }))
     });
    } }}

return (
    <div>
      <Navbar/>
      {currentUser ? <h1 className="pageTitle">{currentUser}'s Profile Page</h1> : <h1>User does not exist</h1>}
  <div className="profilePageCont">
    <div className="leftCol">
      <div className="leftColBox">
        <h1 className="title">Basic Info</h1>

       <div className="body"> 
      
       {authState.username.toLowerCase() === user.toLowerCase() ? ( <div>

        <div className='editable aboutMeEdit'> <ContentEditable
          html={newAboutMe}
          data-column="item"
          className="content-editable"
         onChange={(e)=>{updateAboutMe(e.target.value)}}
          spellcheck="false"
          />  
          </div>
          {showButton && (<button onClick={changeAboutMe}>Save changes</button>)}
       </div>): (
        <div>
          {newAboutMe}
        </div>
       )}
       </div>
        </div>
        <div>     
        {authState.username.toLowerCase() === user.toLowerCase() && 
     (   <div className="registerButtonCont">
<button onClick = {() => {history('/change-password')}}>Change Password</button>
</div>) }
       </div>
       </div>  

        <div className="rightCol">

        <h1 className="title">{currentUser}'s Reviews:</h1>
        {listOfPosts.map((value, key)=>{
          return <div>
            <p className="body1" 
            >{value.title}</p>
            <div className="likeFooterCont">
            <p className="body2" key={key} 
            ><strong>{value.postMessage}</strong>
            &nbsp;&nbsp;&nbsp;&nbsp;<ThumbUpAltIcon className="inline-icon"/>&nbsp;{value.Likes.length}</p>
          
       <div className = "myProfileButtonCont">
      <span><button onClick={()=>history(`/post/${value.id}`)}>Go to review</button>&nbsp;&nbsp;
      {authState.username.toLowerCase() === user.toLowerCase() && 
      (<span><button onClick={() => {deletePost(value.id)}}>Delete Post</button>&nbsp;&nbsp;
      <button onClick={() => {history(`/edit-post/${value.id}`)}}>Edit Post</button>
      </span>
          )}
           </span></div> 
            
      </div>
          </div>
        })}
        </div>
         </div>
         </div>
  )
}

export default Profile