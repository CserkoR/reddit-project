import { useEffect } from 'react';
import auth from './firebase/auth';

export default function Logout(props) {
  const { user, onLogin } = props;
  
  function handleOnClickLogin() {
    auth().signOut().then(() => {
        // Sign-out successful.
      }).catch((error) => {
        // An error happened.
      });
  }

  useEffect(() => {
    auth()
      .onAuthStateChanged((user) => {
        if (!user) {
          onLogin(null);
        }
      });
  }, [ user, onLogin ]);

  return (
    <div className="login-container">
      <button type="button" onClick={handleOnClickLogin}>Kijelentkezés</button>
    </div>
  );
}