import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { withRouter } from 'react-router';
import ScrollUp from 'components/UI/ScrollUp/ScrollUp';
import taken from 'assets/taken.png';
import 'containers/SearchResults/SearchResults.css';
import Spinner from 'components/UI/Spinner/Spinner';
import * as spotifyFunctions from 'spotifyFunctions';

class TopArtists extends Component {
       constructor(){
                super();
                this.state={
                    loading: false,
                    result: null,
                    showScrollBtn: false
                }   
            }
        
            componentDidMount(){
                this.setState({loading: true});
                //get top 50 artists (medium-term) from spotify for the current user
                spotifyFunctions.getTopArtists()
              .then((response => {
                let searchResult = response.items;
                this.setState({loading: false, result: searchResult});
              }))   
              .catch((error => {
                this.setState({loading: false});
                console.log(error);
              }));

                window.addEventListener('scroll', this.scrollHandler)
            }

            componentWillUnmount() {
              window.removeEventListener('scroll', this.scrollHandler);
          }

            scrollHandler = () => {
              //checks if the user has scrolled dowbn at all
              if(window.pageYOffset === 0){
                this.setState({showScrollBtn: false});
            }
            else{
              this.setState({showScrollBtn: true});
            }
            }

            artistClickHandler = (name, uri) => {
              //if an artist is clicked, direct user to the setlists component for that artist
              this.props.history.push({
                pathname: '/setlists',
                state: { artistName: name, artistUri: uri}
              })
            }


        render () {
            let displayResults = '';
            let displayScrollBtn = null;
            if(this.state.result){
              //map artist response object to individual artists to render to DOM
                displayResults =  Object.keys( this.state.result )
                .map( artistKey => {
                  if(this.state.result[artistKey].images.length > 2){
                    return (
                      <Row key={artistKey} className="mb-4">
                        <Col md={{ span: 8, offset: 2 }} className="resultBody mb-4 my-auto" onClick={() => this.artistClickHandler(this.state.result[artistKey].name, this.state.result[artistKey].uri)}>
                        <img className="roundedImg" src={this.state.result[artistKey].images[1].url} alt={this.state.result[artistKey].name}/>
                        <h3 className="mt-3 noselect">{this.state.result[artistKey].name}</h3>
                        </Col>
                        </Row>
                        ); 
                  }
                  else{
                    return (
                      <Row key={artistKey} className="mb-4">
                        <Col md={{ span: 8, offset: 2 }} className="resultBody mb-4 my-auto" onClick={() => this.artistClickHandler(this.state.result[artistKey].name, this.state.result[artistKey].uri)}>
                        <img className="roundedImg" src={taken} alt={this.state.result[artistKey].name}/>
                        <h3 className="mt-3"><span className="artistName">{this.state.result[artistKey].name}</span></h3>
                        </Col>
                        </Row>
                        ); 
                  }
            
                      } );
                      //if there were no artists return in the search
                      if(Object.keys( this.state.result ).length === 0){
                        displayResults = <Row>
                          <Col md={{ span: 8, offset: 2 }} className="resultBody mb-4 my-auto">
                            <h3>No matching artists were found, please try searching again!</h3>
                            </Col>
                        </Row>
                      }
            }
            if( this.state.loading ){
                displayResults = <Spinner />
            }

            if( this.state.showScrollBtn ){
              displayScrollBtn = <ScrollUp />;
            }
            else{
              displayScrollBtn = null;
            }

        return(
            <Container className = "results-section mb-5" fluid>
              <h1 className="mb-5"><span className="resultsTitle">Your Top Spotify Artists</span></h1>
              {displayResults}
                {displayScrollBtn}
                </Container>
                )       
        }
    }
    
export default withRouter(TopArtists);