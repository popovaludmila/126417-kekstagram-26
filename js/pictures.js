import {createCommentsList, fillDataBigPicture} from './big-picture.js';

const pictureListElement = document.querySelector('.pictures');
const pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');

const initPicture = (photos) => {
  const pictureListFragment = document.createDocumentFragment();

  photos.forEach(({url, description, likes, comments}) => {
    const pictureElement = pictureTemplate.cloneNode(true);
    pictureElement.querySelector('.picture__img').src = url;
    pictureElement.querySelector('.picture__img').alt = description;
    pictureElement.querySelector('.picture__likes').textContent = likes;
    pictureElement.querySelector('.picture__comments').textContent = comments.length;

    pictureElement.addEventListener('click', (evt) => {
      evt.preventDefault();
      fillDataBigPicture({url, description, likes, comments});
      createCommentsList(comments);
    });
    pictureListFragment.append(pictureElement);
  }
  );
  pictureListElement.append(pictureListFragment);
};

export {initPicture};
