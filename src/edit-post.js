import { useState, useEffect } from 'react';
import db from './firebase/db'
import { Link, useHistory } from 'react-router-dom';


export default function EditPost() {
    const [postTitle, setPostTitle] = useState('');
    const [postUrl, setPostUrl] = useState('');

    let history = useHistory();

    async function getPost(postId) {
        const thisPost = await db.collection('posts').doc(postId).get()
        const data = thisPost.data()

        setPostTitle(data.title)
        setPostUrl(data.url)
    }

    useEffect(() => {
        return getPost(window.location.pathname.split("/")[2]);
    }, []);

    function handleOnChangePostTitle(event) {
        setPostTitle(event.target.value);
    }

    function handleOnChangePostUrl(event) {
        setPostUrl(event.target.value);
    }

    async function handleOnClickSend(event) {
        event.preventDefault();

        const postId = window.location.pathname.split("/")[2]

        await db.collection('posts').doc(postId)
            .update({
                title: postTitle,
                url: postUrl,
            })

        history.push("/");
    }

    return (
        <>
            <Link className="create-post" to="/">
                <h2>Vissza a Posztokhoz 📖</h2>
            </Link>
            <div className="add-post-container">
                <form onSubmit={handleOnClickSend}>
                    <div className="post-title-div">
                        <label htmlFor="post-title">Bejegyzés szerkesztése<span>*</span></label>
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
                        <label htmlFor="post-url">Url szerkesztése<span>*</span></label>
                        <input
                            required
                            id="post-url"
                            placeholder="http://pelda.hu"
                            type="url"
                            value={postUrl}
                            onChange={handleOnChangePostUrl}></input>
                    </div>
                    <div className="post-button-div">
                        <button type="submit">Frissítés</button>
                    </div>
                </form>
            </div>
        </>
    )
}