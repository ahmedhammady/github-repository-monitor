import React, { Component } from 'react';

export class PageConfig extends Component {
    render() {
        return (
            <div className='page-config'>
                <div className='form-labels'><div className='repo-label'>Time On Screen (min) </div></div>
                <div>
                <input type='number' placeholder='Time On Screen (min)' className='time-on-screen' min='1' value={this.props.time} onChange={(event) => this.props.onTimeOnScreenUpdated(parseInt(event.target.value))} />
                <button onClick={this.props.onDelete} className='removePage'>
                    Delete Page
                </button>
                </div>
            </div>)
    }
}