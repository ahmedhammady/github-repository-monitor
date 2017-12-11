import React, { Component } from 'react';
import ReactTimeAgo from 'react-time-ago'
import javascriptTimeAgo from 'javascript-time-ago'
import { Status } from './Status'
import { Comments } from './Comments'
javascriptTimeAgo.locale(require('javascript-time-ago/locales/en'))
javascriptTimeAgo.locale(require('javascript-time-ago/locales/ru'))
require('javascript-time-ago/intl-messageformat-global')
require('intl-messageformat/dist/locale-data/en')
require('intl-messageformat/dist/locale-data/ru')



export class PullRequest extends Component {

    constructor(props) {
        super(props);
        // this.timeDifference = this.timeDifference.bind(this);
        this.state = { update: this.props.data.updated_at }
    }

    


    render() {
        if (!this.props.data) {
            return <div>No open PRs :) </div> 
        } else {
            return (
                // <ReactAutoScroll
                //   targetPosition={900}
                //   easeType={'linear'}
                //   speed={5}
                //   updateInterval={40}
                //   onScrollingDone={() => console.log('scrolling finished')}
                //   scrollTargetRef={this.refs.scrollExample}
                //   isEnabled>
                <div className='prComponentDiv'>
                    <div className='headerWrapper'>
                        <h4> #{this.props.data.number} {this.props.data.title} (last update: <ReactTimeAgo locale='en-GB'>{new Date(this.props.data.updated_at)}</ReactTimeAgo>)</h4>
                        <div className='prUserDiv'>
                            <img className='prUserImg' src={this.props.data.user.avatar_url} alt='' />
                        </div>
                        <div className='prUserNameDiv'><b className='userNameAndFilesChanged'>by {this.props.data.user.login} ({this.props.data.details.commits} commits, {this.props.data.details.changed_files} files changed)</b></div>
                        <br />
                        <div className='prInfo'>
                            <span className='additions'>+{this.props.data.details.additions} </span><span className='deletions'>-{this.props.data.details.deletions} </span>
                            <Status data={this.props.data} />
                            {this.props.data.details.mergeable ? <span className='mergeableOrBaseable'>Mergeable</span> : <span className='nonMergeableOrBaseable'>Non-Mergeable</span>}
                            {this.props.data.details.mergeable_state === 'dirty' ? <span className='nonMergeableOrBaseable'>Dirty</span> :
                                this.props.data.details.mergeable_state === 'blocked' ? <span className='blockedOrUnknown'>Blocked</span> :
                                    this.props.data.details.mergeable_state === 'behind' ? <span className='nonMergeableOrBaseable'>Behind</span> :
                                        this.props.data.details.mergeable_state === 'clean' ? <span className='mergeableOrBaseable'>Clean</span> :
                                            <span className='blockedOrUnknown'>{this.props.data.details.mergeable_state}</span>}
                        </div>
                    </div>
                    <div className='commentsDiv'>
                        <span><Comments data={this.props.data.comments} /></span>
                    </div>
                    <div className='clearDiv'></div>
                </div>
                // /* </ReactAutoScroll> */
            )
        }
    }
}