import axios from "axios";

const URL = 'https://pixabay.com/api/';
const KEY = '33580589-b96324c4ffac855a3794c7035';
const PARAM = 'image_type=photo&orientation=horizontal&safesearch=true&per_page=40';

export default class ImagesService {
    constructor() {
      this.searchQuery = '';
      this.page = 1;
      this.loadHits = 0;
    }

    async fetchImageSearch() {
      const url = `${URL}?key=${KEY}&q=${this.searchQuery}&${PARAM}&page=${this.page}`;

      try {
        const response = await axios.get(url);
        this.risePage();
  
        return response.data;
      } catch (error) {
        console.warn(`${error}`);
      }
    }

    riseLoadHits(hits) {
      this.loadHits += hits.length;
    }

    resetLoadHits() {
      this.loadHits = 0;
    }

    risePage() {
      this.page += 1;
    }

    resetPage() {
      this.page = 1;
    }

    get query() {
      return this.searchQuery;
    }
  
    set query(newSearch) {
      this.searchQuery = newSearch;
    }
  }
