import React, {useState} from 'react';
import AppBar from './ui/app.bar'
import AppDrawer from './ui/app.drawer'
import {BrowserRouter as Router,
        Switch, Route

} from 'react-router-dom';

import HomePage from './pages/home.page';
import FeedbackPage from './pages/feedback.page';
import UserPage from './pages/user.page';
import PastPapersPage from './pages/past.paper';
import PageNotFound from './pages/not.found.page';

function App() {
  
  const [drawer, setDrawer] = useState(false);
  
  const handleMessage =  (message) => console.log(message) 

  return (
    <section>
      <Router>
        <AppBar onClick={setDrawer}/>
        <AppDrawer open={drawer} onClose={setDrawer} onMessage={handleMessage}/>
        <Switch>
          <Route path="/user">
            <UserPage/>
          </Route>
          <Route path="/feedback">
            <FeedbackPage/>
          </Route>
          <Route path="/pastpapers">
            <PastPapersPage/>
          </Route>
          <Route path="/" exact>
            <HomePage/>
          </Route>
          <Route path="*" >
            <PageNotFound/>
          </Route>
        </Switch>
      </Router>
    </section>
  );
}

export default App;
