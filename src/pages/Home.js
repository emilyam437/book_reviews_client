import React from 'react'
import axios from 'axios';
import {useEffect, useState, useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import {AuthContext} from '../helpers/AuthContext';
import Navbar from './Navbar';

function Home() {

    const [listOfPosts, setListOfPosts] = useState([]);

    const [likedPosts, setLikedPosts] = useState([]);

    let history = useNavigate();

    const {authState} = useContext(AuthContext);

    const likePost = (postId) => {

      axios.post('https://book-review-posts.herokuapp.com/like',
      { UserPostId: postId },
      { headers: {
          accessToken: localStorage.getItem("accessToken"), },
      }).then((res) => {
            setListOfPosts(listOfPosts.map((post) => {
              if (post.id === postId) {
                if (res.data==='unliking') {
                  const likeArray = post.Likes
                  likeArray.pop()
                  return {...post, Likes: [...likeArray]}
                } if (res.data === 'liking') {
                  return {...post, Likes: [...post.Likes, 0]}
                }
              } else {
                return post
              }
            }))
          })
          if (likedPosts.includes(postId)) {
              setLikedPosts(likedPosts.filter((id) => {
                return id !== postId
              }))
          } else {
            setLikedPosts([...likedPosts, postId])
          }
    };

    useEffect(()=>{
      axios.get("https://book-review-posts.herokuapp.com/posts",{ headers: {accessToken: localStorage.getItem("accessToken")}
      }).then((res)=>{
        setListOfPosts(res.data.listOfPosts)
        setLikedPosts(res.data.likedPosts.map((like)=>{
          return like.UserPostId
        }))
        console.log(likedPosts)
      })
    }, [])
  
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
      {!authState.status ? (<div className="notLoggedIn"><h1>Please login or create an account to see content</h1>
      <br/>
      <button onClick={()=>{history('/login')}}>Login / Register</button></div>) :
      (
      <div className = "homePageCont">
        <h1>Book Reviews</h1>
        <button onClick={()=>{history('/createpost')}}>Add Review</button>
        {listOfPosts.map((value, key) => {
          return <div className="postCont" key={key}>
            <p className="title" onClick={() => {history(`/post/${value.id}`)}}> {value.title} </p>
            <p className="body" onClick={() => {history(`/post/${value.id}`)}}>{value.postMessage}</p>
            <div className="footerCont">
            {authState.username === value.username ?
             (<div className="footerCont2">
             <p onClick={() => {history(`/profile/${value.username}`)}} className="footerItem footerClick">{value.username}</p>
             <strong className="xButton" onClick={()=>{deletePost(value.id)}}>&nbsp; &nbsp;x</strong>
             </div>
             ):
             ( <p onClick={() => {history(`/profile/${value.username}`)}} className="footerItem footerClick">{value.username}</p>)
             }
            <div className="footerItem footerClick footerLikes1">{likedPosts.includes(value.id) ? 
            (<ThumbUpAltIcon onClick={() => {likePost(value.id)}}/>) : 
            (<ThumbUpOffAltIcon onClick={() => {likePost(value.id)}}/>)}</div>
            <p className="footerItem footerLikes2">{value.Likes.length}</p>
            </div> 
            <br/>
          </div>
        })}
        {/* <img src="https://qph.cf2.quoracdn.net/main-qimg-c63bc4aeebeffe10a3697a62176fd978-lq" alt=""/> */}
    </div>) }
    <br/>
    </div>
  )
} 

export default Home
