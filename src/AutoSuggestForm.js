import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';


export class AutoSuggestForm extends Component {
  constructor() {
    super();

    this.state = {
      value: '',
      repos: null,
      suggestions: [],
      refreshTime: 1
    };
    // this.handlePlus = this.handlePlus.bind(this);
  }

  getSuggestions(x) {
    const inputValue = x.value.trim().toLowerCase();
    const inputLength = inputValue.length;

    const result = inputLength < 0 ? [] : this.props.repos.filter(repo => {
      return repo.toLowerCase().slice(0, inputLength) === inputValue
    });
    return result;
  };



  // handlePlus() {
  // this.state.suggestions.indexOf(this.state.value) > -1 && this.props.onRepoAdded(this.state.value)
  //   this.setState({
  //     value: '',
  //   })
  // }

  onChange = (event, { newValue, method }) => {
    this.setState({
      value: newValue
    });
  };

  onSuggestionsFetchRequested(x) {
    const result = this.getSuggestions(x);
    this.setState({
      suggestions: result
    });
  };

  onSuggestionsClearRequested(x) {
    this.setState({
      suggestions: []
    });
  };

  renderSuggestion(suggestion) {
    return (
      <div> {suggestion} </div>
    )
  }

  onSuggestionSelected(event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) {
    if (this.state.suggestions.indexOf(suggestionValue) > -1) {
      this.props.onRepoAdded(suggestionValue, this.state.refreshTime)
    }
    this.setState({
      value: '',
    })
  }

  render() {
    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: 'Repository Name',
      value: this.state.value,
      onChange: this.onChange,
      onBlur: () => {
        console.log('CLEAR VALUE IF NOT COMING FROM onSuggestionSelected')
      }
    };

    // Finally, render it!
    return (
      <div className='form-and-refresh'>
        <Autosuggest
          className='autoSuggestForm'
          suggestions={this.state.suggestions || []}
          onSuggestionsFetchRequested={(x) => this.onSuggestionsFetchRequested(x)}
          onSuggestionsClearRequested={(x) => this.onSuggestionsClearRequested(x)}
          renderSuggestion={(suggestion) => this.renderSuggestion(suggestion)}
          getSuggestionValue={(suggestion) => {
            console.log('123', suggestion)
            return suggestion
          }}
          inputProps={inputProps}
          onSuggestionSelected={this.onSuggestionSelected.bind(this)}
          highlightFirstSuggestion={true}
        // scrollBar={true}
        />
        <input type='number' className='refresh-time center-number' placeholder='RT' min='1' value={this.state.refreshTime} onChange={(event) => this.setState({ refreshTime: parseInt(event.target.value) })} />
      </div>
    );
  }
}