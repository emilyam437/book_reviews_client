import React, {useEffect, useState, useContext} from 'react'
import {useParams} from 'react-router-dom';
import axios from 'axios';
import {AuthContext} from '../helpers/AuthContext';
import Navbar from './Navbar';
import ContentEditable from 'react-contenteditable'

function EditPost() {
    const [postObj, setPostObj] = useState({});
    const [showButton, setShowButton] = useState(false);
    const [updatedTitle, setUpdatedTitle] = useState("");
    const [updatedPost, setUpdatedPost] = useState("");
    const {authState} = useContext(AuthContext);
    let {id} = useParams();

    useEffect(() => {
        axios.get(`https://book-review-posts.herokuapp.com/posts/byId/${id}`).then((response) => {
          setPostObj(response.data);
          setUpdatedTitle(response.data.title);
          setUpdatedPost(response.data.postMessage);
        });
      }, []);
      
    const updateTitle = (newTitle, id) => {
        setPostObj({...postObj, title: newTitle})
        setShowButton(true);
        setUpdatedTitle(newTitle)
      }    
      
    const updatePost = (newPost, id) => {
        setPostObj({...postObj, postMessage: newPost})
        setShowButton(true);
        setUpdatedPost(newPost);
      } 

      const saveChanges = (id) => {
        let answer = window.confirm('Save changes?');
        if (answer) {

        axios.put("https://book-review-posts.herokuapp.com/posts/edit-title", 
         { newTitle: updatedTitle,
           id: id }, 
         { headers: { accessToken: localStorage.getItem("accessToken") },
        } ).then(() => {
         setPostObj({...postObj, postMessage: updatedTitle})
         setShowButton(false)
        })

        axios.put("https://book-review-posts.herokuapp.com/posts/edit-post", 
          { newPost: updatedPost,
            id: id }, 
          { headers: { accessToken: localStorage.getItem("accessToken") },
         } ).then(() => {
          setPostObj({...postObj, postMessage: updatedPost})
          setShowButton(false)
         })
        }
      }


  return (
    <div>
        <Navbar/>
        <br/>
        <h2>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Edit Your Post</h2>
        <br/>
    {authState.username === postObj.username ? (
        <div>
        <div className='titleEditCont'>
                    <div className='editable titleEdit'> <ContentEditable
                    html={postObj.title}
                    data-column="item"
                    className="content-editable"
                    onChange={(e)=>{updateTitle(e.target.value, postObj.id)}}
                    />  
                    </div>
                </div>
                    <div className="postEditCont">
    <div className='editable bodyEdit'> <ContentEditable
                    html={postObj.postMessage}
                    data-column="item"
                    className="content-editable"
                onChange={(e)=>{updatePost(e.target.value, postObj.id)}}
                    />  
                    </div>
                    </div>
{showButton && (<button className='savePostChanges' onClick={()=>{saveChanges(postObj.id)}}>Save Changes</button>)}
                    </div>) : (<div><br/><h2>&nbsp;&nbsp;Cannot edit another user's post</h2></div>)}
    </div>
  )
}

export default EditPost