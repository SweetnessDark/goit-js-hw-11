import ImagesService from './js/images-service';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import LoadMoreBtn from './js/load-more-btn';

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');

const imagesService = new ImagesService();

const galleryImg = new SimpleLightbox('.gallery a');

searchForm.addEventListener('submit', onSearchImage);

const loadMoreBtn = new LoadMoreBtn({
  selector: ".load-more",
  isHidden: true,
});

loadMoreBtn.button.addEventListener('click', onLoadMore);

function onSearchImage(e) {
    e.preventDefault();

    imagesService.query = e.currentTarget.elements.searchQuery.value.trim();
    imagesService.resetPage();
    loadMoreBtn.show();
    loadMoreBtn.disable();
    clearGalleryBox();

    if(imagesService.searchQuery === '') {
        return onError();
    }

    imagesService.fetchImageSearch().then(({ hits, totalHits }) => {
        if(!hits.length) {
            return onError();
        }

        loadMoreBtn.enable();
        imagesService.riseLoadHits(hits);
        createGalleryMarkup(hits);
        successLoadImg(totalHits);
        galleryImg.refresh();

        if (hits.length === totalHits) {
          loadMoreBtn.hide();
          endImg();
        }

        if (imagesService.page !== 1) {
          smoothScroll();
        }
    });
}

function successLoadImg(totalHits) {
    Notify.success(`Hooray! We found ${totalHits} images.`);
}
  
function endImg() {
    Notify.info("We're sorry, but you've reached the end of search results.");
}

function onError() {
    Notify.warning("Sorry, there are no images matching your search query. Please try again.");
}

function clearGalleryBox() {
    gallery.innerHTML = '';
}

function createGalleryMarkup(images) {
    const markup = images.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
        return `<div class="photo-card">
        <a href="${webformatURL}">
        <img class="img-card" src="${largeImageURL}" alt="${tags}" loading="lazy" width="300" height="200" />
        </a>
        <div class="info">
          <p class="info-item">
            <b>Likes</b>
            <span>${likes}</span>
          </p>
          <p class="info-item">
            <b>Views</b>
            <span>${views}</span>
          </p>
          <p class="info-item">
            <b>Comments</b>
            <span>${comments}</span>
          </p>
          <p class="info-item">
            <b>Downloads</b>
            <span>${downloads}</span>
          </p>
        </div>
      </div>`
    }).join('');

    gallery.insertAdjacentHTML("beforeend", markup);
}

function onLoadMore() {
  loadMoreBtn.disable();

  imagesService.fetchImageSearch().then(({ hits, totalHits }) => {
    imagesService.riseLoadHits(hits);
    loadMoreBtn.enable();

    if (totalHits <= imagesService.loadHits) {
      loadMoreBtn.hide();
      endImg();
    }

    createGalleryMarkup(hits);
    galleryImg.refresh();
  });
}

function smoothScroll() {
  const { height } = gallery.firstElementChild.getBoundingClientRect();
    

    window.scrollBy({
       top: height * 2,
       behavior: "smooth",
     });
}
