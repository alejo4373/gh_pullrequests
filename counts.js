const axios = require('axios');
const API_URL = 'https://api.github.com';
const auth = require('./secrets');

const getCommitsCount = async (repos) => {
  try {
    let promises = []
    repos.forEach(repo => {
      promises.push(
        axios({
          method: 'get',
          baseURL: API_URL,
          url: `repos/${repo.simpleName}/stats/commit_activity`,
          params: {
            per_page: '10'
          },
          auth
        })
      )
    })

    let responses = await Promise.all(promises)
    let allCommits = []

    let resCount = 0;
    responses.forEach(res => {
      let commits = res.data
      if (Array.isArray(commits)) {
        resCount++
        commits.forEach(commit => {
          allCommits.push(commit.total)
        })
      }
    })
    let totalNumOfCommits = allCommits.reduce((sum, crr) => sum += crr, 0)
    console.log(totalNumOfCommits)
    console.log(resCount)
  } catch (err) {
    throw (err)
  }
}

const getPRsCount = async (repos) => {
  try {
    let promises = []
    // repos = repos.slice(0, 1)
    repos.forEach(repo => {
      promises.push(
        axios({
          method: 'get',
          baseURL: API_URL,
          url: `repos/${repo.simpleName}/pulls`,
          params: {
            state: 'all',
            per_page: '100'
          },
          auth
        })
      )
    })

    let responses = await Promise.all(promises)
    let allPRs = []

    let resCount = 0;
    responses.forEach(res => {
      let prs = res.data.length
      allPRs.push(prs)
      resCount++
    })
    let totalNumOfPRs = allPRs.reduce((sum, crr) => sum += crr, 0)
    console.log(allPRs)
    console.log(totalNumOfPRs)
    console.log(resCount)
  } catch (err) {
    throw (err)
  }
}

module.exports = {
  getCommitsCount,
  getPRsCount
}
