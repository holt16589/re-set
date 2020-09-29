import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import SetlistResult from 'components/SetlistResult/SetlistResult';
import ScrollUp from 'components/UI/ScrollUp/ScrollUp';
import { withRouter } from "react-router";
import 'containers/Setlists/Setlists.css';
import Spinner from 'components/UI/Spinner/Spinner';

class Setlists extends Component {
       constructor(){
                super();
                this.state = {
                    artistName: '',
                    loading: false,
                    pageResults: [],
                    nextPageNum: 1,
                    showScrollBtn: false
        }} 

        componentDidMount() {  
            let artist = this.props.location.state.artistName;
            if(artist){
                this.setState({artistName: artist});
                this.getSetlists(artist);
            }
            window.addEventListener('scroll', this.scrollHandler);
        }

        componentWillUnmount() {
            window.removeEventListener('scroll', this.scrollHandler);
        }

        getSetlists(artistName){
            //make setlist.fm api call to search for setlists for the given artist name
            this.setState({loading: true});
                fetch('/api/getSetlists/' + artistName + '/' + this.state.nextPageNum)
                .then((response => {
                    response.json().then(((response)=> {
                        this.setState(prevState => ({
                            pageResults: [...prevState.pageResults, ...response.setlist],
                            loading: false,
                            nextPageNum: prevState.nextPageNum + 1
                          }));
                    }))
                }))
                .catch((error => {
                    this.setState({loading: false});
                    console.log(error);
                }))
        }

        scrollHandler = () => {
            //once the user scrolls to the bottom of the page, make setlist.fm api call for the next page of results
            //http://blog.sodhanalibrary.com/2016/08/detect-when-user-scrolls-to-bottom-of.html
            const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
            const body = document.body;
            const html = document.documentElement;
            const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight,  html.scrollHeight, html.offsetHeight);
            const windowBottom = windowHeight + window.pageYOffset;
            if (windowBottom >= docHeight) {
                this.setState({loading: true});
                this.getSetlists(this.state.artistName);
            }
            if(window.pageYOffset === 0){
                      this.setState({showScrollBtn: false});
                  }
                  else{
                    this.setState({showScrollBtn: true});
                  }
        }

        setlistClickHandler = (setObject, setSize) => {
            //when user clicks on a specific setlist, link to the setlist page
            if(setSize > 0){
                 this.props.history.push({
                pathname: '/setlist/' + setObject.id,
                state: { set: setObject }
              })
            }
        }
        
        render () {
            let displayResults = null;
            let spinner = null;
            let displayScrollBtn = null;
            if(this.state.loading){
                spinner = <Spinner />
            }
            if( this.state.showScrollBtn ){
                displayScrollBtn = <ScrollUp />;
              }
              else{
                displayScrollBtn = null;
              }

            if(this.state.pageResults){
                //map each setlist in the response to a setlist component to render to DOM
                displayResults =  Object.keys( this.state.pageResults )
                .map( setKey => {
                    let sets = this.state.pageResults[setKey].sets.set;
                    let setSize = 0;
                    if(sets.length > 0){
                        //count the number of tracks in the set
                        sets.forEach(function(obj) { 
                            setSize += obj.song.length;
                        });
                    }

                    return (
                        <SetlistResult key={setKey} 
                        artistName={this.state.pageResults[setKey].artist.name}
                        venueName={this.state.pageResults[setKey].venue.name}
                        cityName={this.state.pageResults[setKey].venue.city.name}
                        countryName={this.state.pageResults[setKey].venue.city.country.name}
                        setDate={this.state.pageResults[setKey].eventDate}
                        setSize={setSize}
                        onClick={() => this.setlistClickHandler(this.state.pageResults[setKey], setSize)}
                        />
                        ); 
                      } );
            }
        return(

<Container className = "setlists-section" fluid>
        {displayResults}
        {spinner}
        {displayScrollBtn}
</Container>
                )       
        }
    }
    
export default withRouter(Setlists);