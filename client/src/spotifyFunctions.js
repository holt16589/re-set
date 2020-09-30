import Spotify from 'spotify-web-api-js';

const spotifyWebApi = new Spotify();

export function getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

export function setToken (params) {
    spotifyWebApi.setAccessToken(params.access_token);
}

//gets user info for the current spotify user
export async function getDisplayName() {
   const response = await spotifyWebApi.getMe();
   return response;
}

//searches Spotify for an artist on spotify given a query string
export async function searchForArtist(query){
    const response = await spotifyWebApi.searchArtists(query);
    return response;
}

//searches Spotify for a song given an artist name and song name 
export async function searchForSong(artistName, songName){
    let query = 'track:' + songName + ' artist:' + artistName;
    const response = await spotifyWebApi.searchTracks(query, { limit : 1 });
    return response;
}

//creates an empty playlist for the current user
export async function createPlaylist(playlistName, userID){
    const response = await spotifyWebApi.createPlaylist(userID, {name: playlistName});
    return response;
}

//given a playlist ID and an array of spotify track URIs, adds tracks to the playlist
export async function addPlaylistTracks(playlistID, trackList){
    const response = await spotifyWebApi.addTracksToPlaylist(playlistID, trackList);
    console.log(response);
    return response;
}

//retrieve the current users top 50 artists in the medium term
export async function getTopArtists(){
    const response = await spotifyWebApi.getMyTopArtists({ limit: 50 });
    return response;
}