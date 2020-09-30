import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Redirect, withRouter } from "react-router";
import Footer from 'components/Layout/Footer/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import 'containers/Search/Search.css';

class Search extends Component {
       constructor(){
                super();
                this.state = {
                showArrow: false,
                searchValue: ''
        }} 
        
        componentDidMount(){
                if(!this.props.loggedIn){
                        this.props.history.push('/login');
                }
        }

        searchValueHandler = ( event ) => {
                //display arrow icon when the user has typed at least one character
                if(event.target.value.length > 0){
                this.setState({showArrow: true, searchValue: event.target.value});       
                } else{
                        this.setState({showArrow: false, searchValue: event.target.value})
                        } }

        searchHandler = () => {
                //when the user presses enter or the arrow icon, display the results
                this.props.history.push({
                        pathname: '/results',
                        state: { searchValue: this.state.searchValue }
                      })
        }

        enterHandler = (e) => {
                //check if the user presses enter
                if(e.keyCode === 13 && this.state.showArrow){
                        this.searchHandler();
                }
        }
        
        render () {
                let arrow;
                if(this.state.showArrow){
                        arrow = <FontAwesomeIcon className="search-arrow" icon={faArrowRight} size ="lg" 
                        onClick={this.searchHandler} 
                        />;
                } else{
                        arrow = null;
                }

        return(
<React.Fragment>
<Container className = "search-section" fluid>
        <Row><Col>
                <form>
                <input className="searchBar" type="input" placeholder="Search for an Artist..." 
                onChange={this.searchValueHandler}
                onKeyDown={this.enterHandler}></input>
                {arrow}
               </form>
        </Col></Row>
</Container>
        <Footer />
        </React.Fragment>
                )       
        }
    }
    
export default withRouter(Search);