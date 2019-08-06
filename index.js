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
        full_name: fork.full_name
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
      // a repo with full name: user/repo will become user@repo for valid 
      // directory naming purposes
      const repoName = repo.full_name.replace(/\//, '@'); 
      const localPath = path.resolve(__dirname, 'forks', repoName);
      clonePromises.push(git.Clone(repo.clone_url, localPath))
    }
    let clonedRepos = await Promise.all(clonePromises)
    return clonedRepos;
  } catch (err) {
    console.error(err)
  }
}

const main = async () => {
  try {
    let forks = await getForks('/repos/alejo4373/6_2_class_names/forks')
    console.log(forks.length)
    let clonedRepos = await cloneRepos(forks)
    console.log('clonedRepos =>', clonedRepos.length)
  } catch (err) {
    throw err;
  }
}

main();
