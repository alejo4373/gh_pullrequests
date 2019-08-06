const axios = require('axios');
const path = require('path');
const git = require('nodegit');
const auth = require('./secrets');
const API_URL = 'https://api.github.com';

const getForks = async (repo_url) => {
  try {
    const res = await axios({
      method: 'get',
      baseURL: API_URL,
      url: repo_url,
      params: {
        per_page: '100'
      },
      auth
    })

    let forks = res.data.map(fork => { 
      return {
        clone_url: fork.clone_url,
        ownerLogin: fork.owner.login,
       }
    })

    return forks
  } catch (err) {
    console.error(err)
  }
}

const cloneRepos = async (repos) => {
  try {
    let clonePromises = []
    for(let repo of repos) {
      const localPath = path.resolve(__dirname, 'forks', repo.ownerLogin);
      clonePromises.push(git.Clone(repo.clone_url, localPath))
    }
    let clonedRepos = await Promise.all(clonePromises)
    return clonedRepos;
  } catch (err) {
    console.error(err)
  }
}

const main = async () => {
  const repo = process.argv[2];
  if (!repo) {
    console.error('No repo name specified')
    return;
  }
  
  try {
    let forks = await getForks(`/repos/${repo}/forks`)
    console.log(forks.length)
    let clonedRepos = await cloneRepos(forks)
    console.log('clonedRepos =>', clonedRepos.length)
  } catch (err) {
    throw err;
  }
}

main();
