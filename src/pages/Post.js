import React, {useEffect, useState, useContext} from 'react'
import {useParams, useNavigate} from 'react-router-dom';
import axios from 'axios';
import {AuthContext} from '../helpers/AuthContext';
import Navbar from './Navbar';

function Post() {
    const [postObj, setPostObj] = useState({});
    const [comment, setComment] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [oneCommentLimit, setOneCommentLimit] = useState(true);
    const {authState} = useContext(AuthContext);
    let {id} = useParams();
    let history = useNavigate();

    useEffect(() => {
      axios.get(`https://book-review-posts.herokuapp.com/posts/byId/${id}`).then((response) => {
        setPostObj(response.data);
      });
      axios.get(`https://book-review-posts.herokuapp.com/comments/${id}`).then((response) => {
        setComment(response.data);
      });
    }, []);

    const addComment = () => {
      axios.post('https://book-review-posts.herokuapp.com/comments',
      {
        commentBody: newComment,
        UserPostId: id
      }, 
      { headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      } ).then((response) => {
          if (response.data.error) {
            console.log(response.data.error);
          } else {
            const commentToAdd = { commentBody: newComment,
              UserPostId: id,
              username: response.data.username
          };
            const newArr = [...comment];
            newArr.unshift(commentToAdd);
            setComment(newArr);
            setNewComment("");
            setOneCommentLimit(false);
          }
        });
    };

    const deleteComment = (commentId, key) => {
      let answer = window.confirm('delete comment?')
      if (answer) {
      if (!commentId) {
        axios.get(`https://book-review-posts.herokuapp.com/comments/all-comments/1`).then((response) => {
          let recentComment = response.data[response.data.length-1].id
          axios.delete(`https://book-review-posts.herokuapp.com/comments/${recentComment}`, { headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        } ).then(() => {
          const newArr = [...comment];
          newArr.splice(key, 1);
          setComment(newArr);
          setNewComment("");
          setOneCommentLimit(true);
          });
        });
      } else {
      axios.delete(`https://book-review-posts.herokuapp.com/comments/${commentId}`, { headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
    } ).then(() => {
        setComment(comment.filter((val)=>{
            return val.id !== commentId
        }))
      });
    } }}

  return (
    <div>
       <Navbar/>
<div className="postPage">
  <div className='leftSide'>

    <p className='title'>{postObj.title}</p>

    <p className='body'>{postObj.postMessage}</p>
    
    <p className='footer clickUser'onClick={() => {history(`/profile/${postObj.username}`)}}>{postObj.username}</p>

  </div>

  <div className='rightSide'>
  <h3>Comments!</h3>
{oneCommentLimit &&  (
<div className="addCommentContainer">
      <input type="text" placeholder="Add comment" className='inputSubmit' value={newComment}
            onChange={(event)=> {
              setNewComment(event.target.value)
            }}/>
     
      <button className='submitButton2' onClick={addComment}>Submit</button>
</div>
)}
<div className='listOfComments'>
{comment.map((value, key) => {
 return <div  key={key}>
  <p className='comment'>{value.commentBody} {(authState.username === value.username) && (<p className='xButton' onClick={()=>{deleteComment(value.id, value.key)}}>&nbsp; &nbsp;x</p>)}</p>
  <p className='user' onClick={() => {history(`/profile/${value.username}`)}}>- {value.username}</p>
  </div>
})}
  </div>
  </div>
</div>
</div>
  )
}

export default Post