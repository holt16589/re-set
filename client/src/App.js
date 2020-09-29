import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Search from 'containers/Search/Search';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import SearchResults from 'containers/SearchResults/SearchResults';
import Layout from 'components/Layout/Layout';
import About from 'components/About/About';
import Setlists from 'containers/Setlists/Setlists';
import ViewSetlist from 'components/ViewSetlist/ViewSetlist';
import TopArtists from 'containers/TopArtists/TopArtists';
import * as spotifyFunctions from 'spotifyFunctions';

library.add(fab);

class App extends Component {

  constructor(){
    super();
    const params = spotifyFunctions.getHashParams();
    this.state={
      loggedIn: params.access_token  ? true : false,
      userInfo: ''
    }
    if (params.access_token){
      spotifyFunctions.setToken(params);
    }
  }

  componentDidMount () {
    //get display name to show in the navbar 
    if(this.state.loggedIn){
      spotifyFunctions.getDisplayName()
.then((response =>  {
  this.setState(
  {userInfo: response});
 console.log(response);
  }
 ))
 .catch(function(error){
   console.log(error);
 });
  }
    }


  render() {
      return (
        <Router>
      <Layout loggedIn={this.state.loggedIn} displayName={this.state.userInfo.display_name} >
          <Switch>
            <Route exact path="/" render={props =>
            (<Search {...props} loggedIn={this.state.loggedIn} />)}/>
             <Route path="/results" component={SearchResults} />
             <Route path="/topartists" component={TopArtists} />
             <Route path="/about" component={About} />
             <Route path="/setlists" component={Setlists} />
             <Route exact path="/setlist/:id" render={props =>
            (<ViewSetlist {...props} userID={this.state.userInfo.id} loggedIn={this.state.loggedIn}/>)}/>
          </Switch>
        </Layout>
  </Router>
  );
  }
}

export default App;
