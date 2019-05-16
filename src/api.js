import axios from 'axios';

export default function getFeed(url) {
  return axios(`https://cors-anywhere.herokuapp.com/${url}`);
}
