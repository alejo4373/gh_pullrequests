const axios = require('axios');
const path = require('path');
const fsPromises = require('fs').promises;
const git = require('nodegit');
const auth = require('./secrets');
const API_URL = 'https://api.github.com';
const counts = require('./counts')

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
    for (let repo of repos) {
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
  } catch (err) {
    if (err.code === "EEXIST") {
      return destPath
    } else {
      throw (err)
    }
  }
}

const handleReposFile = async (reposFile) => {
  try {
    const filePath = path.resolve(__dirname, reposFile)
    let file = await fsPromises.readFile(filePath, 'utf-8')
    let bareRepos = file.split('\n');
    let repos = []
    for (let repo of bareRepos) {
      if (repo)
        repos.push({
          ownerLogin: repo.split('/')[0],
          simpleName: repo,
          clone_url: `https://github.com/${repo}.git`
        })
    }
    return repos;
  } catch (err) {
    throw (err)
  }
}

const main = async () => {
  const repoArg = process.argv[2];
  const dest = process.argv[3];

  if (!dest) {
    throw new Error('No destination folder specified');
  }

  if (!repoArg) {
    throw new Error('No repo name or --repos-file=repos.txt option specified')
  }

  const destPath = await handleDestFolder(dest);
  const [option, optionValue] = repoArg.split('=')
  let clonedRepos;
  let repos;
  try {
    switch (option) {
      case "--repos-file":
        repos = await handleReposFile(optionValue)
        clonedRepos = await cloneRepos(repos, destPath)
        break;
      case "--forks-from":
        const forks = await getForks(`/repos/${optionValue}/forks`)
        clonedRepos = await cloneRepos(forks, destPath)
        break;
      case "--commits-count":
        repos = await handleReposFile(optionValue)
        const reposCommitsCountMap = await counts.getCommitsCount(repos)
        break;
      case "--prs-count":
        repos = await handleReposFile(optionValue)
        await counts.getPRsCount(repos)
        break;
      default:
        console.warn("!!! No valid option specified");
        break;
    }
    // console.log(`[MSG] ${clonedRepos.length} repos cloned to ${destPath}`)
  } catch (err) {
    throw err;
  }
}

main();
