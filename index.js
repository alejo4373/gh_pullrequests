const axios = require('axios');
const auth = require('./secrets')
const API_URL = 'https://api.github.com' 

const main = async () => {
  try {
    const res = await axios({
      method: 'get',
      baseURL: API_URL,
      url: '/repos/alejo4373/6_2_class_names/forks',
      params: {
        per_page: '100'
      },
      auth
    })
    console.log('res =>', res.data.length)
  } catch (err) {
    throw err;
  }
}

main();
