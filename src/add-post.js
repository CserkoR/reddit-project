import { useState } from 'react';
import db from './firebase/db'
import { Link, useHistory } from 'react-router-dom';

export default function AddPost(props) {
    const [postTitle, setPostTitle] = useState('');
    const [postUrl, setPostUrl] = useState('');

    let history = useHistory();

    function handleOnChangePostTitle(event) {
        setPostTitle(event.target.value);
    };

    function handleOnChangePostUrl(event) {
        setPostUrl(event.target.value);
    };

    function checkUser() {
        if (props.user) {
            return props.user.displayName;
        } else {
            return "Anonymus";
        }
    };

    async function handleOnClickSend(event) {
        event.preventDefault();

        await db.collection('posts')
            .add({
                owner: checkUser(),
                score: 0,
                timestamp: Math.floor(Date.now() / 1000),
                title: postTitle,
                url: postUrl,
                upvoteusers: [],
                downvoteusers: [],
                votedequalusers: []
            });

        history.push("/");
    };

    return (
        <>
            <Link className="create-post" to="/">
                <h2>Vissza a Posztokhoz 📖</h2>
            </Link>
            <div className="add-post-container">
                <form onSubmit={handleOnClickSend}>
                    <div className="post-title-div">
                        <label htmlFor="post-title">Bejegyzés címe<span>*</span></label>
                        <input
                            required
                            id="post-title"
                            placeholder="Ez az én bejegyzésem"
                            type="text"
                            value={postTitle}
                            autoFocus
                            onChange={handleOnChangePostTitle}></input>
                    </div>
                    <div className="post-url-div">
                        <label htmlFor="post-url">Url<span>*</span></label>
                        <input
                            required
                            id="post-url"
                            placeholder="http://pelda.hu"
                            type="url"
                            value={postUrl}
                            onChange={handleOnChangePostUrl}></input>
                    </div>
                    <div className="post-button-div">
                        <button type="submit">Elküldés</button>
                    </div>
                </form>
            </div>
        </>
    )
}