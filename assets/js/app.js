console.log( "hello world");

const axios = require('axios');

async function makeGetRequest() {

  let res = await axios.get('https://character-database.becode.xyz/characters');

  let data = res.data;
  console.log(data);
}

makeGetRequest();