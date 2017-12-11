import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';

export class AddedRepo extends Component {
    render() {
        return (
            <div className='repoAdded'>
                <input type="text" disabled="disabled" className="react-autosuggest__input added" value={this.props.repoName} />
                <input disabled="disabled" className="refresh-time added" value={this.props.refreshTime} />
                <button className='removeRepo' onClick={this.props.removeRepo}>✖</button>
            </div>
        )
    }
}