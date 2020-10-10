import React from 'react';
import './Track.css';

// const isRemoval = true;

export class Track extends React.Component {
  renderAction() {
    if (this.props.isRemoval) {
      return <button className="Track-action" onClick={this.removeTrack.bind(this)}>-</button>
    } else {
      return <button className="Track-action" onClick={this.addTrack.bind(this)}>+</button>;
    }
  }

  addTrack() {
    this.props.onAdd(this.props.track);
  }

  removeTrack() {
    this.props.onRemove(this.props.track);
  }

  render() {
    return (
      <div className="Track">
        <div className="Track-information">
          <h3>{this.props.track.name}</h3>
          <p>{this.props.track.album} | {this.props.track.artist}</p>
        </div>
        {this.renderAction()}
      </div>
    )
  }
}