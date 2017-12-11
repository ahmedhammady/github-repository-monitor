import * as GitHub from 'github-api';

let config;
let gitHub;

refreshConfig();

export function refreshConfig() {
    config = {
        token: localStorage.getItem('organisationToken'),
        organisation: localStorage.getItem('organisationName')
    };

    gitHub = new GitHub({
        token: config.token
    });
}

export function getAllRepos() {
    // if (!config.token || !config.organisation) {
    //     return Promise.resolve([]);
    // }
    return gitHub.getOrganization(config.organisation).getRepos().then(response => {
        return response.data.map(repo => repo.name);
    });
}

export function getPullRequests(repoName) {
    const repository = gitHub.getRepo(config.organisation, repoName);
    return repository.listPullRequests().then(response => {
        return Promise.all(response.data.map(item => {
            return Promise.all([getDetails(repository, item), getStatus(repository, item), getComments(repository, item)])
                .then(([details, status, comments]) => {
                    return {
                        title: item.title,
                        number: item.number,
                        updated_at: item.updated_at,
                        user: {
                            avatar_url: item.user.avatar_url,
                            login: item.user.login
                        },
                        state: item.state,
                        body: item.body,
                        comments,
                        status,
                        details
                    }
                });
        }));
    });
}

function getDetails(repository, pullRequest) {
    return repository._request('GET', pullRequest.url).then(response => {
        return {
            additions: response.data.additions,
            deletions: response.data.deletions,
            mergeable: response.data.mergeable,
            rebaseable: response.data.rebaseable,
            mergeable_state: response.data.mergeable_state,
            commits: response.data.commits,
            changed_files: response.data.changed_files
        }
    });
}

function getStatus(repository, pullRequest) {
    return repository._request('GET', pullRequest.statuses_url).then(response => {
        return (response.data && response.data.length) ? response.data[0].state : '---';
    });
}

function getComments(repository, pullRequest) {
    return Promise.all([
        repository._request('GET', pullRequest.comments_url),
        repository._request('GET', pullRequest.review_comments_url),
    ]).then(responses => {
        return processComments(responses);
    });
}

function processComments(responses) {
    return [].concat(...responses.map(item => {
        return item.data;
    })).map(item => {
        return {
            body: item.body,
            updated_at: item.updated_at,
            user: {
                avatar_url: item.user.avatar_url,
                login: item.user.login
            }
        }
    }).sort((a, b) => {
        return b.updated_at > a.updated_at;
    });
}
