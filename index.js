const axios = require('axios');
const path = require('path');
const fsPromises = require('fs').promises;
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

const cloneRepos = async (repos, destPath) => {
  try {
    let clonePromises = []
    for(let repo of repos) {
      const repoLocalPath = path.resolve(destPath, repo.ownerLogin);
      clonePromises.push(git.Clone(repo.clone_url, repoLocalPath))
    }
    let clonedRepos = await Promise.all(clonePromises)
    return clonedRepos;
  } catch (err) {
    console.error(err)
  }
}

const handleDestFolder = async (dest) => {
  const destPath = path.resolve(__dirname, dest);
  try {
    await fsPromises.mkdir(destPath, { recursive: true });
    console.log("Created folder: " + destPath)
    return destPath;
  } catch(err) {
    if (err.code === "EEXIST") {
      return destPath
    } else {
      throw (err)
    }
  }
}

const main = async () => {
  const repo = process.argv[2];
  const dest = process.argv[3];

  if (!dest) {
    throw new Error('No destination folder specified');
  }

  const destPath = await handleDestFolder(dest);

  if (!repo) {
    throw new Error('No repo name specified')
  }
  
  try {
    let forks = await getForks(`/repos/${repo}/forks`)
    console.log(forks.length)

    let clonedRepos = await cloneRepos(forks, destPath)
    console.log('clonedRepos =>', clonedRepos.length)
  } catch (err) {
    throw err;
  }
}

main();
