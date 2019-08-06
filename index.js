const axios = require('axios');
const auth = require('./secrets')
const API_URL = 'https://api.github.com' 

const main = async () => {
  try {
    const res = await axios({
      method: 'get',
      baseURL: API_URL,
      url: '/user',
      auth
    })
    console.log('res =>', res.data)
  } catch (err) {
    throw err;
  }
}

main();
