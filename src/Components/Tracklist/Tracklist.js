import React from 'react';
import './Tracklist.css';
import { Track } from '../Track/Track';

export class Tracklist extends React.Component {
  componentWillReceiveProps(props) {
    // console.log("tracks are " + props.tracks)
  }

  render() {
    return (
      <div className="TrackList">
        {
          this.props.tracks.map(track => {
            return <Track key={track.id} track={track}
              onAdd={this.props.onAdd}
              isRemoval={this.props.isRemoval}
              onRemove={this.props.onRemove} />
          })
        }
      </div>
    )
  }
}