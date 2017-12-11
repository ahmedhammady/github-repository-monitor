import React, { Component } from 'react';
import * as GitHub from './services/github';
import { PullRequest } from './PullRequest';


export class Brick extends Component {
    constructor(props) {
        super(props)
        this.state = { className: 'brick', style: { width: 'calc(33% - 10px)' }, clicked: 'no', repoData: [], loaded: false };
        this.handleClick = this.handleClick.bind(this);
        GitHub.getPullRequests(this.props.reponame).then(repoData => {
            this.setState({
                ...this.state,
                repoData: repoData,
                loaded: true
            })
        });
        const refreshTimeMs = this.props.refreshTime * 60000;
        console.log('refreshTimeMs', refreshTimeMs)
        this.interval = setInterval(() => {
            console.log('refreshed!');
            GitHub.getPullRequests(this.props.reponame).then(repoData => {
                this.setState({
                    ...this.state,
                    repoData: repoData
                })
            })
        }, refreshTimeMs)
    }

    handleClick() {
        if (this.state.clicked === 'no') {
            this.setState({
                clicked: 'yes'
            })
        } else if (this.state.clicked === 'yes') {
            this.setState({
                clicked: 'no'
            })
        }
    }

    componentDidMount() {
        // height: 'calc(100vh - 5px)';
        // width: 'calc((100vw / 3) - 10px)';
        if (this.props.totalnumber === 1) {
            this.setState({
                style: {
                    ...this.state.style,
                    width: 'calc(100% - 10px)',
                }
            })

        } else if (this.props.totalnumber === 2) {
            this.setState({
                style: {
                    ...this.state.style,
                    width: 'calc(50% - 10px)'
                }
            });

        } else if (this.props.totalnumber === 3) {
            this.setState({
                style: {
                    ...this.state.style,
                    width: 'calc(33% - 4px)',
                }
            })
        }
    }

    componentWillUnmount() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    render() {
        return (
            <div className={this.state.className} onClick={this.handleClick} style={this.state.style} >
                <div className='repoNameDiv'>
                    <p className='repoName'> {this.props.reponame} </p>
                </div>

                {!this.state.loaded ? <div class="sk-cube-grid">
                    <div class="sk-cube sk-cube1"></div>
                    <div class="sk-cube sk-cube2"></div>
                    <div class="sk-cube sk-cube3"></div>
                    <div class="sk-cube sk-cube4"></div>
                    <div class="sk-cube sk-cube5"></div>
                    <div class="sk-cube sk-cube6"></div>
                    <div class="sk-cube sk-cube7"></div>
                    <div class="sk-cube sk-cube8"></div>
                    <div class="sk-cube sk-cube9"></div>
                </div> :
                    <div className='prsDiv'>
                        {(!this.state.repoData || this.state.repoData.length === 0) && <div className='noPrs'> No Open Pull Requests <i class="fa fa-thumbs-up" aria-hidden="true"></i></div>}
                        <ul className='prUl'>
                            {this.state.repoData && this.state.repoData.map(pr => {
                                return <li className='prsLi'><PullRequest data={pr} /></li>
                            })}
                        </ul>
                    </div>}
            </div>
        )
    }
} 