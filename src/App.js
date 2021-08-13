import './App.css';
import './App.scss';

import Header from './header'
import RenderPosts from './posts'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { useState } from 'react';
import AddPost from './add-post'
import EditPost from './edit-post'
import NewForm from './new-form'



function App() {
  const [user, setUser] = useState(null);


  return (
    <main className="App">
      <Router>
        <Header user={user} setUser={setUser} />
        <Switch>
          <Route exact path="/">
            <RenderPosts user={user} />
          </Route>
          <Route exact path="/add-post">
            <AddPost user={user} />
          </Route>
          <Route exact path="/edit-post/:id">
            <EditPost user={user} />
          </Route>
          <Route exact path="/newform">
            <NewForm />
          </Route>
        </Switch>
      </Router>
    </main>
  );
}


export default App;
