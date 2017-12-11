import React, { Component } from 'react';
import ReactTimeAgo from 'react-time-ago'
import javascriptTimeAgo from 'javascript-time-ago'
javascriptTimeAgo.locale(require('javascript-time-ago/locales/en'))
javascriptTimeAgo.locale(require('javascript-time-ago/locales/ru'))
require('javascript-time-ago/intl-messageformat-global')
require('intl-messageformat/dist/locale-data/en')
require('intl-messageformat/dist/locale-data/ru')

export class Comments extends Component {

    render() {
        const itemsToRender = this.props.data ? this.props.data.slice(0, 3) : [];

        return (
            <div >
                <ol style={{listStyleType:'none', textAlign: 'left', margin: '0', padding: '0'}}>
                    { itemsToRender.map(item => {
                        return <li className='comment'><b>{item.user.login}</b> <span>(<ReactTimeAgo locale='en-GB'>{new Date(item.updated_at)}</ReactTimeAgo>)</span> 
                        <br/>
                        {item.body} </li>
                    })}
                </ol>
            </div>
        )
    }
}