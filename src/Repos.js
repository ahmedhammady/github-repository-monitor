import React, { Component } from 'react';
import { Brick } from './Brick';
import { Link } from 'react-router-dom';


export class Repos extends Component {

  constructor(props) {

    super(props);

    let repoConfig = localStorage.getItem('repoConfig');
    if (repoConfig) {
      repoConfig = JSON.parse(repoConfig);
    }

    this.state = {
      pages: repoConfig || [],
      repoData: [],
      style: { top: 0 }
    }

    if (this.state.pages.length > 0) {
      this.setupNextPageUpdate(0);      
    }
  }

  setupNextPageUpdate(currentPageIndex) {
    console.log('setting up for next page, index:', currentPageIndex)
    this.timeout = setTimeout(() => {
      if (this.state.style.top <= (this.state.pages.length - 1) * (-window.innerHeight)) {
        this.setState({
          ...this.state,
          style: {
            top: 0
          }
        });
        this.setupNextPageUpdate(0);
      } else {
        this.setState({
          ...this.state,
          style: {
            top: this.state.style.top - window.innerHeight
          }
        });
        this.setupNextPageUpdate(currentPageIndex + 1);
      }
    }, 60000 * this.state.pages[currentPageIndex].timeOnScreen)
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  render() {
    console.log ('pages Length', this.state.pages.length)
    return (
      <div id='viewPort'>
        {this.state.pages.length && this.state.pages[0].repos.length > 0 &&
          <div id='reposAndButtonDiv'>
            <div className='repos' style={this.state.style}>
              {this.state.pages.map(items => {
                return (<div className='rob-is-amazing'>{items.repos.map((item) => {
                  return <Brick key={item.name} reponame={item.name} totalnumber={items.repos.length} refreshTime={item.refreshTime} />
                })}<div className="clear"></div></div>)
              })
              }
            </div>
            <Link to='/config' style={{ textDecoration: 'none', color: 'white' }} className='configOrReposButton'>
              Configuration Page
            </Link>
          </div>
        }
        {!(this.state.pages.length && this.state.pages[0].repos.length > 0) && <div className='noPages'>
          <h1 className='no-pages-title'>No Pages to Show</h1>
            <Link to='/config' style={{ textDecoration: 'none', color: 'white' }} className='noPagesButton'>
              Go to Configuration Page</Link>
        </div>}
      </div>
    );
  }
}