import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { RepoForm } from './RepoForm';
import { AutoSuggestForm } from './AutoSuggestForm';
import { AddedRepo } from './AddedRepo'
import * as GitHub from './services/github';
import { PageConfig } from './PageConfig';
import { debug } from 'util';


export class Config extends Component {
    constructor(props) {
        super(props)

        const storedOrganisationName = localStorage.getItem('organisationName');
        const storedToken = localStorage.getItem('organisationToken');

        this.state = {
            // pages: [[{ name: 'test'}, { name: 'test1'}, { name: 'test3'}], [{ name: 'test4'}], [{ name: 'test5'}, { name: 'test6'}]],
            pages: JSON.parse(localStorage.getItem('repoConfig')) || [{ repos: [], timeOnScreen: 1 }],
            isRefreshingRepoList: false,
            organisation: {
                name: storedOrganisationName ? storedOrganisationName : '',
                token: storedToken ? storedToken : '',
            }
        }
    
    }

        componentDidMount () {
        this.getAllRepos().then(repos => {
            this.setState({
                ...this.state,
                allRepos: repos
            })
        });
    }


    getAllRepos() {
        const storedRepos = localStorage.getItem('allRepos');
        if (storedRepos) {
            return Promise.resolve(JSON.parse(storedRepos));
        } else if (!storedRepos && localStorage.getItem('organisationName') && localStorage.getItem('organisationToken')) {
            console.log('getting all repos')
            this.setState({
                ...this.state,
                isRefreshingRepoList: true
            });

            return GitHub.getAllRepos().then(repos => { // this takes ages, don't call it too often
                localStorage.setItem('allRepos', JSON.stringify(repos));
                this.setState({
                    ...this.state,
                    isRefreshingRepoList: false,
                    couldNotLoadRepos: false
                });

                return repos;

            });



        } else {
            return Promise.resolve(null);
        }
    }

    updateConfig() {
        console.log('UPDATED CALL')
        this.setState(this.state);
        localStorage.setItem('repoConfig', JSON.stringify(this.state.pages));
        localStorage.setItem('organisationName', this.state.organisation.name);
        localStorage.setItem('organisationToken', this.state.organisation.token);
    }

    handleNewPage() {
        this.state.pages.push({ repos: [], timeOnScreen: 1 })
        this.setState(this.state)
    }

    handleNewRepo(name, refreshTime, pageIndex) {
        this.state.pages[pageIndex].repos.push({ name: name, refreshTime: refreshTime })
        this.updateConfig()
        console.log(this.state.pages)
    }

    handleRemoveRepo(name, pageIndex) {
        var array = this.state.pages[pageIndex].repos
        var index = array.indexOf({ name: name });
        array.splice(index, 1);
        this.updateConfig()
    }

    handleRemovePage(pageIndex) {
        var array = this.state.pages;
        array.splice(pageIndex, 1);
        this.updateConfig();
    }

    updateTimeOnScreen(time, pageIndex) {
        this.state.pages[pageIndex].timeOnScreen = time;
        this.updateConfig();
    }

    updateOrganisationName(newName) {
        this.state.organisation.name = newName;
        this.updateConfig();
        GitHub.refreshConfig();
    }

    updateOrganisationToken(newToken) {
        this.state.organisation.token = newToken;
        this.updateConfig();
        GitHub.refreshConfig();
    }

    refreshReposList() {
        if (this.state.isRefreshingRepoList) {
            return;
        }

        this.setState({
            ...this.state,
            isRefreshingRepoList: true
        });

        GitHub.getAllRepos().then(repos => { // this takes ages, don't call it too often
            localStorage.setItem('allRepos', JSON.stringify(repos));
            this.setState({
                ...this.state,
                isRefreshingRepoList: false,
                couldNotLoadRepos: false,
                allRepos: repos
            });
        })
            .catch(error => {
                console.log('REJECCION', error);
                this.setState({
                    ...this.state,
                    isRefreshingRepoList: false,
                    couldNotLoadRepos: true
                });
            });


    }

    renderRepos() {
        return (
            <div>

                <div className="repository-list">
                    {this.state.pages.map((page, pageIndex) => {

                        return (
                            <div className="page-container" key={pageIndex}>
                                {/* <div>PAGE {pageIndex + 1}</div> */}
                                <div className='repo-config'>                                
                                <div className='form-labels'><div className='repo-label'>Repository Name </div><div className='auto-refresh-label'>Auto-Refresh</div></div>
                                    {page.repos.map((repo) => {
                                        return (
                                            // <div key={repo.name} className='repoAdded'>
                                            <AddedRepo repoName={repo.name} refreshTime={repo.refreshTime} removeRepo={(name) => this.handleRemoveRepo(name, pageIndex)} />
                                            //     <button className='removeRepo' onClick={(name) => this.props.removeRepo}>
                                            //     ✖
                                            //     </button>
                                            // </div>)
                                        )
                                    }
                                        //<div>   {repo.name} --- handleClick({pageIndex}, {repo.name})</div>
                                    )}

                                    {page.repos.length < 3 && <div className='autoForm'> <AutoSuggestForm repos={this.state.allRepos} onRepoAdded={(name, refreshTime) => this.handleNewRepo(name, refreshTime, pageIndex)} /> </div>}

                                    {/* {repos.length < 3 && <div><RepoForm onRepoAdded={(name) => this.handleNewRepo(name, pageIndex)} repos={this.state.allRepos}/> </div>} */}
                                </div>
                                <PageConfig onDelete={() => this.handleRemovePage(pageIndex)} time={page.timeOnScreen} onTimeOnScreenUpdated={(time) => this.updateTimeOnScreen(time, pageIndex)} />
                            </div>
                        )
                    })
                    }
                    {/* <RepoForm value= {this.state.repoInput} repoInput={this.state.repoInput} onChange={this.handleChange} onSubmit={this.handlePlus} repoArray={this.state.repoArray} onEnter={this.handleEnter}/> */}
                </div>
                <div className='newPageDiv'>
                    <button className='newPageButton' onClick={() => { this.handleNewPage() }}> New Page</button>
                </div>
            </div>
        );
    }

    renderNoRepos() {
        if (this.state.isRefreshingRepoList) {
            return (
                <div className='configPage'>
                    <div class="sk-cube-grid config-page-cube">
                        <div class="sk-cube sk-cube1"></div>
                        <div class="sk-cube sk-cube2"></div>
                        <div class="sk-cube sk-cube3"></div>
                        <div class="sk-cube sk-cube4"></div>
                        <div class="sk-cube sk-cube5"></div>
                        <div class="sk-cube sk-cube6"></div>
                        <div class="sk-cube sk-cube7"></div>
                        <div class="sk-cube sk-cube8"></div>
                        <div class="sk-cube sk-cube9"></div>
                    </div>
                </div>
            )
        } else {
            return
        }
    }

    render() {

        return (
            <div className='configPage'>
                <h1>Configuration Page</h1>

                <div className='organisation-info-container'>
                    <h4 className='organisation-title'> Organisation Information</h4>
                    <div className='organisation-inputs-and-button'>
                        <input type='text' placeholder='Organisation Name' className={this.state.couldNotLoadRepos ? 'organisation-name-and-token redBorder' : 'organisation-name-and-token'} value={localStorage.getItem('organisationName')} onChange={(event) => this.updateOrganisationName(event.target.value)} />
                        <input type='text' placeholder='Token' className={this.state.couldNotLoadRepos ? 'organisation-name-and-token redBorder' : 'organisation-name-and-token'} value={localStorage.getItem('organisationToken')} onChange={(event) => this.updateOrganisationToken(event.target.value)} />
                        {localStorage.getItem('allRepos') ? <button className='refresh-repos-list hovered' onClick={() => { localStorage.getItem('allRepos') ? this.refreshReposList() : this.getAllRepos }} alt='Refresh Repos List'>
                            <i class={this.state.isRefreshingRepoList ? "fa fa-refresh rotate" : "fa fa-refresh"} aria-hidden="true"></i>
                            {/* <div className='descriptionBox'> Refresh Repos List </div>  */}
                        </button> :
                            <button className='refresh-repos-list hovered' onClick={() => {
                                this.getAllRepos().then(repos => {
                                    this.setState({
                                        ...this.state,
                                        allRepos: repos
                                    })
                                })
                            }}
                                alt='Refresh Repos List'>
                                Find Repos
                        </button>}
                    </div>
                </div>
                {localStorage.getItem('allRepos') ? this.renderRepos() : this.renderNoRepos()}
                <div className='flex'>
                    <div className='centering'>
                        <Link to='/' style={{ textDecoration: 'none', color: 'white' }} className=' configOrReposButton'>
                            Repos
                </Link>
                    </div>
                </div>
            </div>
        )
    }
}