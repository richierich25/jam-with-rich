let accessToken = '';
let expiresIn = '';
const clientID = '65ead4c4b861435a9fe892bbce377b70';
const redirectURI = "http://jammwithrichard.surge.sh/";

export const Spotify = {

  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }

    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

    if (accessTokenMatch && expiresInMatch) {
      // let queryString = window.location.search;
      // const urlParams = new URLSearchParams(queryString);
      // accessToken = urlParams.get('access_token');
      // expiresIn = urlParams.get('expires_in'); 
      accessToken = accessTokenMatch[1];
      expiresIn = Number(expiresInMatch[1]);
      window.setInterval(() => accessToken = '', expiresIn * 1000);
      //pushState(state, title, uri)
      window.history.pushState('Access Token', null, '/');
      // console.log(accessToken + ' ' + expiresIn);
      return accessToken;
    } else {
      window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
    }
  },


  async search(term) {
    let endPoint = `https://api.spotify.com/v1/search?type=track&q=${term}`;
    const accessToken = this.getAccessToken();

    try {
      let response = await fetch(endPoint, {
        headers: {
          'Authorization': 'Bearer ' + accessToken
        }
      });
      if (response.ok) {
        let jsonResponse = await response.json();
        if (!jsonResponse.tracks) {
          return [];
        }
        return jsonResponse.tracks.items.map(track => {
          return {
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            id: track.id,
            uri: track.uri

          }
        });
      };
      throw new Error('Request failed!');
    } catch (error) {
      console.log(error);
    }

  },

  savePlaylist(name, trackUris) {
    if (!name || !trackUris) {
      return;
    }
    const accessToken = this.getAccessToken();
    const headers = { 'Authorization': `Bearer ${accessToken}` };
    let userId;

    return fetch(`https://api.spotify.com/v1/me`, { headers: headers })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Request failed for userID!');
      })
      .then(jsonResponse => {
        userId = jsonResponse.id;
        console.log(`The Id is : ${jsonResponse.id}`);

        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name: name })
        })
          .then(response => {
            if (response.ok) {
              return response.json();
            }
            throw new Error('Request failed for playlist creation!');
          })
          .then(jsonResponse => {
            const playlistId = jsonResponse.id;
            console.log(`The Playlist id is : ${playlistId}`);

            return fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ uris: trackUris })
            })
              .then(response => {
                if (response.ok) {
                  return response.json();
                }
                throw new Error('Request failed for playlist track insertion!');
              })
              .then(jsonResponse => {
                console.log(`The final response is : ${jsonResponse}`);
              })

          })

      })
      .catch(error => console.log(error));


  }

};