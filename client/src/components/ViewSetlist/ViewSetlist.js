import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Container, Col, Row } from 'react-bootstrap';
import Spinner from 'components/UI/Spinner/Spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShareAlt } from '@fortawesome/free-solid-svg-icons';
import 'components/ViewSetlist/ViewSetlist.css';
import taken from 'assets/taken.png';
import * as spotifyFunctions from 'spotifyFunctions';

class ViewSetlist extends Component {
    constructor(props) {
      super();
      this.state = {
        setObject: null,
        loading: false,
        error: false,
        fmTracks: null,
        spotify: null,
        copied: false,
        loggedIn: false,
        playlistURL: ''
}}

componentDidMount(){
  this.setState({loggedIn: this.props.loggedIn});
  let spotifyTracks = [];
  let setTracks = [];
  let artistName = '';
            this.setState({loading: true});
            //fetch setlist data from setlist.fm API
                fetch('/api/getSetlist/' + this.props.match.params.id)
                .then((response => {
                    response.json().then(((response)=> {
                        artistName = response.artist.name;
                        this.setState({setObject: response});
                        //parse the tracks from the response and push to array, check to see if song is found on Spotify
                        Object.entries(response.sets.set).forEach(
                          (set)=>{
                            set[1].song.forEach(
                              (song)=>{
                                setTracks.push(song.name);
                                spotifyTracks.push(spotifyFunctions.searchForSong(artistName, song.name));
                                })
                              }
                            )
                            Promise.all(spotifyTracks).then((data)=>{
                              this.setState({fmTracks: setTracks, spotify: data})
                          }
                        )
                      
                    }))
                    .then(
                      () =>{
                        this.setState({loading: false})
                      }
                    )
                }))
                .catch((error => {
                    this.setState({loading: false, error: true});
                    console.log(error);
                }))
}

copyUrlHandler = () => {
  //when "copy to clickboard" button is clicked, save the current url to the clipboard
  this.setState({copied: true});
  let dummy = document.createElement('input'),
  text = window.location.href;
  document.body.appendChild(dummy);
  dummy.value = text;
  dummy.select();
  document.execCommand('copy');
  document.body.removeChild(dummy);
}

saveSetlistHandler = () => {
  //handle api call to create spotify playlist
  let uriList = [];
  let playlistName = this.state.setObject.artist.name + " at " + this.state.setObject.venue.name + ", " + this.state.setObject.eventDate;
  if(this.state.spotify && this.props.userID){
    //create array of track URIs for spotify API
    this.state.spotify.forEach(
      (track)=>{
        uriList.push(track.tracks.items[0].uri);
      }
    );
    
    //create playlist and add tracks
    spotifyFunctions.createPlaylist(playlistName, this.props.userID).then( (playlistObj) => {
      spotifyFunctions.addPlaylistTracks(playlistObj.id, uriList);
      this.setState({playlistURL: playlistObj.external_urls.spotify});
    alert("Playlist successfully saved!");
    }
    )
    .catch((error) => {
      console.log(error);
      alert("An error occurred while saving your playlist, please try again!");
    }
    )
   
  }

}

    render() {
      let displaySetlist = null;
      let tracklist = null;
      let setSize = 0;
      let availableSet = 0;
      let displayImage = <Spinner color={2}/>;
      let imageUrl = '';

      if(this.state.loading){
        displaySetlist = <Spinner />
      }

      if(this.state.setObject){
        
        if(this.state.fmTracks && this.state.spotify){
          //search each track from the setlist and identify the first track with an available album art image to display
          setSize = this.state.fmTracks.length;
          for(let i = 0; i < this.state.spotify.length; i++){
            if(this.state.spotify[i].tracks.items.length > 0 ){
          if(this.state.spotify[i].tracks.items[0].album.images.length > 1){
            imageUrl = this.state.spotify[i].tracks.items[0].album.images[1].url;
            break;
            }
          }
          }
          if(imageUrl){
            //if album art is available from setlist tracks
           displayImage= <img className = "displayImg" src={imageUrl} alt={this.state.setObject.artist.name}/>;
          }
          else{
            //if no album art was available, set to default image
            displayImage= <img className = "displayImg" src={taken} alt="Unavailable"/>;
          }

          //map list of tracks to li elements and number accordingly
          tracklist = <ul className="songList">
          {
            this.state.fmTracks.map((item, index) => {
              if(this.state.spotify[index].tracks.items.length !== 0 ){
                availableSet +=1;
              }
              return <li key={index} className={this.state.spotify[index].tracks.items.length === 0 ? "notAvailable" : ""}>{index + 1}. <span className="trackLi">{item}</span></li>;
            }
            
            )
          }
      </ul>;
      
        }

        if(this.state.fmTracks && this.state.fmTracks.length > 0){
          //if the user is not logged in, direct them to login page to save playlist
          let playlistBtn = <a href="http://localhost:8888"><span className="setButton">
          <FontAwesomeIcon className="faIcon" icon={['fab', 'spotify']} />Login to Save Playlist</span></a>
          if(this.state.loggedIn){
          //if user is logged in, show button to save setlist
            playlistBtn = <span className="setButton" onClick={this.saveSetlistHandler}>
       <FontAwesomeIcon className="faIcon" icon={['fab', 'spotify']} />
        Save Playlist</span>;
          }
          if(this.state.playlistURL){
            //once the playlist is created, change "Save Setlist" to "View Setlist" and link to spotify playlist URL
            playlistBtn = <a href={this.state.playlistURL} target="_blank"><span className="setButton">
       <FontAwesomeIcon className="faIcon" icon={['fab', 'spotify']} />
        View Playlist</span></a>;
          }

          //build component to be displayed with tracklist and set details
          displaySetlist = <Container className="setContainer">
        <Row className="setTitle">
        <h2><span className="titleStyle">{this.state.setObject.artist.name} at {this.state.setObject.venue.name}, {this.state.setObject.eventDate}</span></h2>
        </Row>
        <Row>
      <Col sm={12} md={6} className="set-overview">
     {displayImage}
     <div>
     <p><span className="subHead">Location: </span>{this.state.setObject.venue.city.name}{this.state.setObject.venue.city.name && this.state.setObject.venue.city.country.code ? "," : ""} {this.state.setObject.venue.city.country.code}</p>
     <p><span className="subHead">Availability: </span>{availableSet}/{setSize} tracks found</p>
     {playlistBtn}
        <span className="setButton" onClick={this.copyUrlHandler}>
       <FontAwesomeIcon className="faIcon" icon={ faShareAlt } />
        {this.state.copied ? "Copied!" : "Copy to Clipboard"}</span>
     </div>

     </Col>
      <Col sm={12} md={6} className ="set-details">
      {tracklist}
  </Col>
  </Row>
    </Container>;
        }
        else{
          //if the setlist is empty, display message and ask user to search again.
          displaySetlist = <Container className="setContainer">
          <Row className="setTitle">
          <h2><span className="titleStyle">{this.state.setObject.artist.name} at {this.state.setObject.venue.name}, {this.state.setObject.eventDate}</span></h2>
          </Row>
          <Row>
        <Col sm={12} md={6} className="set-overview">
       {displayImage}
       <div>
       <p><span className="subHead">Location: </span>{this.state.setObject.venue.city.name}{this.state.setObject.venue.city.name && this.state.setObject.venue.city.country.code ? "," : ""} {this.state.setObject.venue.city.country.code}</p>
       <p><span className="subHead">Availability: </span>{availableSet}/{setSize} tracks found</p>
       </div>
  
       </Col>
        <Col sm={12} md={6} className ="set-details">
        Unfortunately, this setlist is empty. Please try searching again!
    </Col>
    </Row>
      </Container>;
        }
        
      }
      

      return (
        <React.Fragment>
          {displaySetlist}
          </React.Fragment>
      );
    }
  }

export default withRouter(ViewSetlist);