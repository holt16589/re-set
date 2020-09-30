import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Footer from 'components/Layout/Footer/Footer';
import './Login.css';
import Spinner from 'components/UI/Spinner/Spinner';


class Login extends Component {
    constructor(){
        super();
        this.state = {
            loading: false
        }
    }

    loginClickHandler = () => {
        this.setState({loading:true});
        fetch('/api/login/')
        .then( (response) => {
            this.setState({loading: false});
            response.json().then(
                (data) => {
                    window.location.assign(data.redirect);
                }
            )
        }
        )
        .catch((error) =>{
            this.setState({loading: false});
            console.log(error);
        });
      }

    render() {

        let buttonTxt = 'Login with Spotify';
        if(this.state.loading){
            buttonTxt = 'Loading...';
        }

        return(
                <React.Fragment>
<Container className = "about-section" fluid>
        <Row><Col>
        <div className="container login-section">
      <div id="login">
        <h1 className="title">re-set</h1>
        <h2>Log in with Spotify to get started.</h2>
        <Button className="spotify-login" onClick={() => this.loginClickHandler()}>{buttonTxt}</Button>
      </div>
    </div>
        </Col></Row>
</Container>
<Footer />
</React.Fragment>
        )
    }   
}

export default withRouter(Login);