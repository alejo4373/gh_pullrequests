const axios = require('axios');
const auth = require('./secrets')
const API_URL = 'https://api.github.com' 

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
    return res.data;
  } catch (err) {
    console.error(err)
  }
}

const main = async () => {
  try {
    let forks = await getForks('/repos/alejo4373/6_2_class_names/forks')
    let forksUrls = forks.map(fork => fork.clone_url)
    console.log(forksUrls)
  } catch (err) {
    throw err;
  }
}

main();
