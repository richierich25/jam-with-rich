import React from 'react';
import './App.css';
import { Playlist } from '../Playlist/Playlist';
import { SearchResults } from '../SearchResults/SearchResults';
import { SearchBar } from '../SearchBar/SearchBar';
import { Spotify } from '../../util/Spotify';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchResults: [],
      playlistName: 'New Playlist',
      playlistTracks: []
    }
  }

  addTrack(track) {
    const trackPresent = this.state.playlistTracks.some(oldTrack => {
      return track.id === oldTrack.id
    });
    let tracks = this.state.playlistTracks;
    tracks.push(track);
    if (!trackPresent) {
      this.setState({
        playlistTracks: tracks
      });
    }

  }

  removeTrack(track) {
    const newPlaylist = this.state.playlistTracks.filter(oldTrack => {
      return track.id !== oldTrack.id
    });
    this.setState({
      playlistTracks: newPlaylist
    });
  }

  updatePlaylistName(name) {
    this.setState({
      playlistName: name
    });
  }

  savePlaylist() {
    let name = this.state.playlistName;
    let arrURIs = this.state.playlistTracks.map(track => {
      return track.uri;
    });
    console.log(`name is ${name} and uri is ${arrURIs}`);
    Spotify.savePlaylist(name, arrURIs)
      .then(response => {
        this.setState({
          playlistName: 'New Playlist',
          playlistTracks: []
        })
      })
      .catch(error => console.log(error));

  }

  async search(term) {
    this.setState({
      searchResults: await Spotify.search(term)
    })
  }
  // search(term) {
  //   Spotify.search(term).then(searchResults => {
  //     this.setState({searchResults: searchResults});
  //   });
  // }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mm</span>ingWith<span className="highlight">Richard</span></h1>
        <div className="App">
          <SearchBar onSearch={this.search.bind(this)} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack.bind(this)} />
            <Playlist name={this.state.playlistName} tracks={this.state.playlistTracks} onRemove={this.removeTrack.bind(this)}
              onNameChange={this.updatePlaylistName.bind(this)} onSave={this.savePlaylist.bind(this)} />
          </div>
        </div>
      </div>
    );
  }

}

export default App;
