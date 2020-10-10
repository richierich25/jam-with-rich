import React from 'react';
import './SearchBar.css';

export class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      term: ''
    }
  }

  handleTermChange(event) {
    this.setState({ term: event.target.value });
  }

  search() {
    this.props.onSearch(this.state.term);
  }

  render() {
    return (
      <div className="SearchBar">
        <input placeholder="Enter A Song, Album, or Artist" value={this.state.term} onChange={this.handleTermChange.bind(this)} />
        <button className="SearchButton" onClick={this.search.bind(this)}>SEARCH</button>
      </div>
    )
  }
}