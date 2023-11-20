
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { refs } from './refs.js';
import {showLoader, hideLoader, renderPhotoCard } from './galleryFunctions.js';
import { fetchImages, options } from './api.js';

const { galleryContainer, searchInput, searchForm, loaderContainer } = refs;


let isFetchingMore = false;
let hasReachedEnd = false;

const lightbox = new SimpleLightbox('.lightbox', {
  captionsData: 'alt',
  captionDelay: 250,
  enableKeyboard: true,
  showCounter: false,
  scrollZoom: false,
  close: false,
});

searchForm.addEventListener('submit', onFormSubmit);
document.addEventListener('DOMContentLoaded', hideLoader);


function renderGallery(hits) {
  const markup = hits.map(renderPhotoCard).join('');
  galleryContainer.insertAdjacentHTML('beforeend', markup);

  lightbox.refresh();
}

async function loadMore() {
  if (isFetchingMore || hasReachedEnd) return;

  isFetchingMore = true;
  options.params.page += 1;

  try {
    showLoader();
    const {hits, totalHits} = await fetchImages();
    
    renderGallery(hits);

    const totalPages = Math.ceil(totalHits / options.params.per_page);
    if (options.params.page >= totalPages) {
      hasReachedEnd = true;
      Notify.warning("You've reached the end of search results.");
    }

  } catch (err) {
    Notify.failure(err);
  } finally {
    hideLoader();
    isFetchingMore = false;
  }
}

function onScrollHandler() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  const scrollThreshold = 300;

  if (
    scrollTop + clientHeight >= scrollHeight - scrollThreshold &&
    galleryContainer.innerHTML !== '' &&
    !isFetchingMore &&
    !hasReachedEnd
  ) {
    loadMore();
  }
}

async function onFormSubmit(e) {
  e.preventDefault();
  options.params.q = searchInput.value.trim();
  if (options.params.q === '') {
     Notify.warning('Please enter a search query.');
     return
  }
  options.params.page = 1;
  galleryContainer.innerHTML = '';
  hasReachedEnd = false;

  
  try {
    showLoader();
    const {hits, totalHits} = await fetchImages();
    
    if (totalHits === 0) {
      Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      return
    } 
      
      Notify.success(`Hooray! We found ${totalHits} images.`);

      if (totalHits > 40) {
        window.addEventListener('scroll', onScrollHandler);
      } 

      renderGallery(hits);
    
    

    searchInput.value = '';
  } catch (err) {
    Notify.failure(err);
  } finally {
    hideLoader();
  }
}
