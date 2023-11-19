import { refs } from './refs.js';


export function showLoader() {
  refs.loaderContainer.style.display = 'block';
}

export function hideLoader() {
  refs.loaderContainer.style.display = 'none';
}

export function renderPhotoCard(item) {
    return `
      <a href="${item.largeImageURL}" class="lightbox">
          <div class="photo-card">
              <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" />
              <div class="info">
                  <p class="info-item">
                      <b>Likes</b>
                      ${item.likes}
                  </p>
                  <p class="info-item">
                      <b>Views</b>
                      ${item.views}
                  </p>
                  <p class="info-item">
                      <b>Comments</b>
                      ${item.comments}
                  </p>
                  <p class="info-item">
                      <b>Downloads</b>
                      ${item.downloads}
                  </p>
              </div>
          </div>
      </a>
    `;
  }