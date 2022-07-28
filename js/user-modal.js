import { isEscapeKey } from './util.js';
import { bodyElement } from './big-picture.js';
import {scaleControlBiggerBtnElement, scaleControlSmallerBtnElement, setDefaultPhotoScale,
  increaseScalePhoto, decreaseScalePhoto} from './scale-photo.js';
import {createSlider, destroySlider } from './effect-photo.js';
import { validateUploadForm, pristine } from './validate-form.js';
import { sendData } from './api.js';
import {showSuccessModal, showErrorModal, errorModalElement} from './status-upload.js';
import { uploadNewPhoto } from './upload-photo.js';

const imgUpLoadFormElement = document.querySelector('.img-upload__form');
const upLoadFileInputElement = imgUpLoadFormElement.querySelector('#upload-file');
const imgUpLoadOverLayElement = imgUpLoadFormElement.querySelector('.img-upload__overlay');
const imgUpLoadCancelBtnElement = imgUpLoadOverLayElement.querySelector('#upload-cancel');
const textCommentsElement  = imgUpLoadOverLayElement.querySelector('.text__description');
const hashtagsInputElement = imgUpLoadFormElement.querySelector('.text__hashtags');
const imgUpLoadSubmitBtnElement = imgUpLoadFormElement.querySelector('.img-upload__submit');

const onUpLoadModalEscKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();

    if (document.activeElement === hashtagsInputElement ||
      document.activeElement === textCommentsElement || document.activeElement !== errorModalElement) {
      evt.stopPropagation();
    } else {
      closeUpLoadModal();
    }
  }
};

const openUpLoadModal = () => {
  imgUpLoadOverLayElement.classList.remove('hidden');
  bodyElement.classList.add('.modal-open');
  createSlider();
  scaleControlBiggerBtnElement.addEventListener('click', decreaseScalePhoto);
  scaleControlSmallerBtnElement.addEventListener('click', increaseScalePhoto);
  document.addEventListener('keydown', onUpLoadModalEscKeydown);
  uploadNewPhoto();
};

upLoadFileInputElement.addEventListener('change', openUpLoadModal);

function closeUpLoadModal() {
  imgUpLoadOverLayElement.classList.add('hidden');
  bodyElement.classList.remove('.modal-open');
  setDefaultPhotoScale();
  destroySlider();
  scaleControlBiggerBtnElement.removeEventListener('click', decreaseScalePhoto);
  scaleControlSmallerBtnElement.removeEventListener('click', increaseScalePhoto);
  document.removeEventListener('keydown', onUpLoadModalEscKeydown);
  imgUpLoadFormElement.reset();
  upLoadFileInputElement.value = '';
  hashtagsInputElement.value = '';
  textCommentsElement.value = '';
  pristine.reset();
}

imgUpLoadCancelBtnElement.addEventListener('click', () => {
  closeUpLoadModal();
});


const blockSubmitButton = () => {
  imgUpLoadSubmitBtnElement.setAttribute('disabled', true);
  imgUpLoadSubmitBtnElement.textContent = 'Публикую...';
};

const unblockSubmitButton = () => {
  imgUpLoadSubmitBtnElement.removeAttribute('disabled');
  imgUpLoadSubmitBtnElement.textContent = 'Опубликовать';
};

const setUserModalSubmit = () => {
  imgUpLoadFormElement.addEventListener('submit', (evt) => {
    evt.preventDefault();
    blockSubmitButton();

    const isValid = validateUploadForm();
    if (isValid) {
      sendData(
        () => {
          unblockSubmitButton();
          closeUpLoadModal();
          showSuccessModal();
        },
        () => {
          blockSubmitButton();
          showErrorModal();
          unblockSubmitButton();
        },
        new FormData(evt.target),
      );
    }
  });
};

export {setUserModalSubmit};