import downvoted from './assets/downvoted.png';
import upvoted from './assets/upvoted.png';
import downvote from './assets/downvote.png';
import upvote from './assets/upvote.png';

import { useState, useEffect } from 'react';
import db from './firebase/db';
import timestampHandler from './timestampHandler';
import { Link } from 'react-router-dom';
import firebase from 'firebase/app';



function RenderPosts(props) {

  const [posts, setPosts] = useState([]);
  const [orderType, setOrderType] = useState('title');
  const [orderDirection, setOrderDirection] = useState('desc');

  /* Oo~~~~~~~~~~~~~~~~~~~~~~( BETÖLTÉS )~~~~~~~~~~~~~~~~~~~~~~(oO */

  function getAllPosts(setPosts) {
    db.collection('posts').orderBy(orderType, orderDirection).onSnapshot((posts) => {
      const post = [];
      posts.forEach((doc) => {
        post.push({
          ...doc.data(),
          id: doc.id
        });
      });
      setPosts(post);
      console.log("asd")
    });
  }

  useEffect(() => {
    getAllPosts(setPosts);
  }, [orderDirection]);

  /* Oo~~~~~~~~~~~~~~~~~~~~~~( SORREND )~~~~~~~~~~~~~~~~~~~~~~(oO */

  function handleOrderOnClick(e) {
    const orderBy = e.target.dataset.name;

    (orderBy === "title") ? setOrderType("title") : setOrderType("score");
    (orderDirection === "asc") ? setOrderDirection("desc") : setOrderDirection("asc");
  }

  /* Oo~~~~~~~~~~~~~~~~~~~~~~( SZAVAZÁS )~~~~~~~~~~~~~~~~~~~~~~(oO */

  async function upvoteHandler(e) {
    if (props.user) {
      const thisPost = e.target.parentElement.parentElement.getAttribute("data-id")
      const post = db.collection('posts').doc(thisPost);
      const doc = (await post.get()).data();

      if (!doc.upvoteusers.includes(props.user.email) && !doc.downvoteusers.includes(props.user.email) && !doc.votedequalusers.includes(props.user.email)) {
        post.update({
          score: firebase.firestore.FieldValue.increment(1),
          upvoteusers: [...doc.upvoteusers, props.user.email]
        })
      } else if (doc.downvoteusers.includes(props.user.email)) {
        post.update({
          score: firebase.firestore.FieldValue.increment(1),
          downvoteusers: firebase.firestore.FieldValue.arrayRemove(props.user.email),
          votedequalusers: [...doc.votedequalusers, props.user.email]
        })
      } else if (doc.votedequalusers.includes(props.user.email)) {
        post.update({
          score: firebase.firestore.FieldValue.increment(1),
          upvoteusers: [...doc.upvoteusers, props.user.email],
          votedequalusers: firebase.firestore.FieldValue.arrayRemove(props.user.email)
        })
      }
    }
  }


  async function downvoteHandler(e) {
    if (props.user) {
      const thisPost = e.target.parentElement.parentElement.getAttribute("data-id")
      const post = db.collection('posts').doc(thisPost);
      const doc = (await post.get()).data();

      if (!doc.downvoteusers.includes(props.user.email) && !doc.upvoteusers.includes(props.user.email) && !doc.votedequalusers.includes(props.user.email)) {
        post.update({
          score: firebase.firestore.FieldValue.increment(-1),
          downvoteusers: [...doc.downvoteusers, props.user.email]
        })
      } else if (doc.upvoteusers.includes(props.user.email)) {
        post.update({
          score: firebase.firestore.FieldValue.increment(-1),
          upvoteusers: firebase.firestore.FieldValue.arrayRemove(props.user.email),
          votedequalusers: [...doc.votedequalusers, props.user.email]
        })
      } else if (doc.votedequalusers.includes(props.user.email)) {
        post.update({
          score: firebase.firestore.FieldValue.increment(-1),
          downvoteusers: [...doc.downvoteusers, props.user.email],
          votedequalusers: firebase.firestore.FieldValue.arrayRemove(props.user.email)
        })
      }
    }
  }

  /* Oo~~~~~~~~~~~~~~~~~~~~~~( NYÍLAK )~~~~~~~~~~~~~~~~~~~~~~(oO */

  function imgUpvote(users) {
    if (props.user) {
      if (users.includes(props.user.email)) {
        return upvoted;
      }
      return upvote;
    }
    return upvote;
  }

  function imgDownvote(users) {
    if (props.user) {
      if (users.includes(props.user.email)) {
        return downvoted;
      }
      return downvote;
    }
    return downvote;
  }

  /* Oo~~~~~~~~~~~~~~~~~~~~~~( SZERK. - TÖRL. GOMBOK )~~~~~~~~~~~~~~~~~~~~~~(oO */

  function ownerMatchUser(owner) {
    if (props.user) {
      if (owner === props.user.displayName || owner === "Anonymus") {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  /* Oo~~~~~~~~~~~~~~~~~~~~~~( TÖRLÉS )~~~~~~~~~~~~~~~~~~~~~~(oO */

  async function postDeleteHandler(e) {
    db.collection('posts').doc(e.target.getAttribute("data-id")).delete();
  }

  /* Oo~~~~~~~~~~~~~~~~~~~~~~( RENDER )~~~~~~~~~~~~~~~~~~~~~~(oO */

  return (
    <>
      <Link className="create-post" to="add-post">
        <h2>Poszt létrehozása ✏️</h2>
      </Link>
      <div className="filter">
        <p onClick={handleOrderOnClick} data-name="title">Név szerinti</p>
        <p onClick={handleOrderOnClick} data-name="score">Pontok szerinti</p>
      </div>
      {posts.map((post) => (
        <div key={post.id} className="posts" data-id={post.id}>
          <div className="vote">
            <img src={imgUpvote(post.upvoteusers)} className={props.user && "upvote vote-buttons"} alt="upvote" onClick={upvoteHandler} />
            <span value="asd">{post.score}</span>
            <img src={imgDownvote(post.downvoteusers)} className={props.user && "downvote vote-buttons"} alt="downvote" onClick={downvoteHandler} />
          </div>
          <div className="post-info">
            <div className="post-title">
              <a href={post.url} target="_blank" rel="noreferrer">{post.title}<span className="title-span">({post.url})</span></a>
            </div>
            <div className="post-descript">
              <div>
                Posztolta <span>{post.owner}</span>, ekkor {timestampHandler(post.timestamp)}
              </div>
              {ownerMatchUser(post.owner) && <div className="posts-button">
                <button className="delete-button" data-id={post.id} onClick={postDeleteHandler}>Törlés</button>
                <Link to={"edit-post/" + post.id}>
                  <button>Szerkesztés</button>
                </Link>
              </div>}
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

export default RenderPosts;