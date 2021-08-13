import { Link } from 'react-router-dom';
import background from './assets/planet.jpg';
import Login from './login';
import Logout from './logout';
//import { useState } from 'react';


function Header(props) {
    const {user, setUser} = props;

    return (
        <header className="App-header">
            <img src={background} className="App-background" alt="background" />
            <div className="header-container">
                <Link to="/">
                    {!user && <img src="https://styles.redditmedia.com/t5_2qh87/styles/communityIcon_ub69d1lpjlf51.png?width=256&amp;s=920c352b6d0c69518b6978ba8b456176a8d63c25" className="header-logo-anonym" alt="header-logo"></img>}
                    {user && <img src={props.user.photoURL} className="header-logo-user" alt="header-logo"></img>}
                </Link>
                <div className="overflow">
                    <h1>/r/space: news, articles and discussion</h1>
                    {!user && <h3>Üdvözöllek <span>Anonymus</span>! A posztok értékeléséhez be kell jelentkezned.</h3>}
                    {user && <h3>Üdvözöllek <span>{user.displayName}</span>! Kellemes időtöltést az oldalon.</h3>}
                </div>
                {!user && <Login user={user} onLogin={setUser} />}
                {user && <Logout user={user} onLogin={setUser} />}
            </div>
        </header>
    );
}

export default Header;