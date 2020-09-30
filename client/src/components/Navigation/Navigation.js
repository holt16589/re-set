import React from 'react';
import { Nav, Navbar, Button, DropdownButton, Dropdown } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { withRouter, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import 'components/Navigation/Navigation.css';

const navigation = ( props ) => {
  const { location } = props;

  //hide the navigation component on the login route
  if (location.pathname.match(/login/)){
    return null;
  }

    let loginButton = null;
    let topArtists = null;
    if(props.loggedIn){
        loginButton = <DropdownButton alignRight variant="secondary" id="displayName-btn" title={props.displayName}>
        <Dropdown.Item href="https://re-set.herokuapp.com/">Sign out</Dropdown.Item>
        </DropdownButton>;
        topArtists = <Nav.Item className="nav-item"><NavLink to="/topartists" ><span className="nav-hover">Your Top Artists</span></NavLink></Nav.Item>;
    }
    else{
        //if user is not logged in, show "Login" button
        loginButton = 
        <Link to="/login"><Button className="spotify-login" variant="nav">Login to Spotify</Button>
        </Link>;
    }

        return(
 <Navbar className="navigationBar" expand="lg">
         <Navbar.Brand>
         <NavLink to="/" exact style={{ textDecoration: 'none' }}><div className="logo-text">re-set</div></NavLink>
    </Navbar.Brand>
    <Navbar.Toggle aria-controls="responsive-navbar-nav">
    <span>
      <FontAwesomeIcon
        icon={faBars} color="white" size="lg"
      />
    </span>
    </Navbar.Toggle>
  <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="items">
            <Nav.Item className="nav-item"><NavLink to="/" exact ><span className="nav-hover">Home</span></NavLink></Nav.Item>
            {topArtists}
            <Nav.Item className="nav-item"><NavLink to="/about" ><span className="nav-hover">About</span></NavLink></Nav.Item>
        </Nav>
        {loginButton}
        </Navbar.Collapse>
    </Navbar>
        )
}

export default withRouter(navigation);