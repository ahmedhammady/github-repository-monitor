import React, { Component } from 'react';
import { AutoSuggestForm } from './AutoSuggestForm';
import * as GitHub from './services/github';


export class RepoForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            value: '',
            submitting: 'Submit',
            repoArray: this.props.repoArray
        }
        this.onEnter = this.onEnter.bind(this)
        this.handlePlus = this.handlePlus.bind(this)
    }

    handleLiClick(event, item) {
        var array = this.props.repoArray;
        var index = array.indexOf(item);
        array.splice(index, 1);
        console.log(index, item);
        this.setState({
            repoArray: array
        })
    }

    onEnter(e) {
        if (e.key === 'Enter') {
            this.state.value.length > 0 && this.props.onRepoAdded(this.state.value)
            this.setState({
                value: '',
            })
        }  //SEND THE repoInput TO AN ARRAY AND MAKE A NEW LINE
    }

    handlePlus() {
        this.state.value.length > 0 && this.props.onRepoAdded(this.state.value)
        console.log(this.state.value)
        this.setState({
            value: '',
        })
    }

    render() {
        return (
            <div className='repoFormDiv'>
                {/* 
                <input type='text'
                    name='repoName'
                    className='repoForm'
                    placeholder='Name of Repository'
                    ref='repoName'
                    value={this.state.value}
                    onChange= {(e) => this.setState({value: e.target.value})} 
                    onKeyPress = {this.onEnter} /> */}
                <button className='repoButton' onClick={this.handlePlus}>
                    +
                </button>
                <div>
                    {/* {this.props.repoArray.map((item) => {
                    return <ul className='reposAddedList'>
                        <li>{item} <button key={item} onClick={(e) => this.handleLiClick(e, item)}>x</button></li>
                        </ul>
                })
                } */}
                </div>
                <br />
            </div>
        )
    }
}