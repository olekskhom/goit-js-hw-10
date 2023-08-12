import axios from 'axios';

axios.defaults.headers.common['x-api-key'] = 'live_jIwUGnvix9bq2j6eYJ7ye3tsvGK1eL2cGvoOlYwfeujgB300MWBugtnbhjbcfmKC';

export const BASE_URL = 'https://api.thecatapi.com/v1';

export function fetchBreeds() {
  return axios.get(`${BASE_URL}/breeds`);
}

export function fetchCatByBreed(breedId) {
  return axios.get(`${BASE_URL}/images/search?breed_ids=${breedId}`);
}