var Dataloder = require('dataloader');
var axios = require('axios');

axios.defaults.baseURL = 'https://swapi.co/api/';
axios.defaults.headers.common['Accept'] = "application/json";

function Film() {
  return new Dataloder(ids => {
    return axios.all(ids.map(id => {
      var url = Number.isInteger(id)
        ? `films/${id}`
        : id;

      return axios.get(url).then(res => res.data)
    }))
  })
}

function Planet() {
  return new Dataloder(ids => {
    return axios.all(ids.map(id => {
      var url = Number.isInteger(id)
        ? `planets/${id}`
        : id;

      return axios.get(url).then(res => res.data)
    }))
  })
}

function Character() {
  return new Dataloder(ids => {
    return axios.all(ids.map(id => {
      var url = Number.isInteger(id)
        ? `people/${id}`
        : id;

      return axios.get(url).then(res => res.data)
    }))
  })
}


module.exports = function () {
  return {
    film: Film(),
    character: Character(),
    planet: Planet()
  }
}

// var film = Film();
// film.load(1)
//     .then(data => console.log(data))
//     .catch(err => console.error(err))
