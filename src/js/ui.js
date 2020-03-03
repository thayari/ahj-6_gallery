import Image from './image';

export default class Ui {
  constructor() {
    this.form = document.querySelector('.file-container');
    this.imagesContainer = document.querySelector('.images-container');
    this.images = new Set();
    this.fileInput = document.getElementById('file');
    this.addForm = document.querySelector('.add-form');
  }

  start() {
    if (localStorage.gallery) {
      this.load();
      this.images.forEach((item) => {
        this.addImgHtml(item.url, item.title);
      });
    }
    this.addEventOnFile();
    this.deleteImage();
  }

  static textWidthByImg(item) {
    const title = item.querySelector('.title');
    const imgWidth = item.querySelector('img').offsetWidth;
    title.style.width = `${imgWidth}px`;
  }

  addEventOnFile() {
    document.getElementById('overlap').addEventListener('click', () => {
      this.fileInput.dispatchEvent(new MouseEvent('click'));
    });

    this.fileInput.addEventListener('change', (event) => {
      const files = Array.from(event.currentTarget.files);
      this.addFromFile(files);
    });

    this.addForm.addEventListener('dragover', (event) => {
      event.preventDefault();
      this.addForm.classList.add('outline');
    });

    this.addForm.addEventListener('drop', (event) => {
      event.preventDefault();
      const files = Array.from(event.dataTransfer.files);
      this.addFromFile(files);
    });

    this.addForm.addEventListener('mouseout', () => {
      this.addForm.classList.remove('outline');
    });
  }

  addFromFile(files) {
    const file = files[0];
    const title = file.name;
    const url = URL.createObjectURL(file);
    const newImage = new Image(url, title);
    this.images.add(newImage);
    this.addImgHtml(newImage.url, newImage.title);
    this.save();
  }

  addImgHtml(url, title) {
    const newImageElement = document.createElement('div');
    newImageElement.classList.add('image');
    newImageElement.innerHTML = `<div class="close"></div>
      <a href="${url}"><img src="${url}" alt="${title}"></a>
      <div class="title">${title}</div>`;
    this.imagesContainer.appendChild(newImageElement);
    Ui.textWidthByImg(newImageElement);
  }

  deleteImage() {
    this.imagesContainer.addEventListener('click', (event) => {
      if (event.target.classList.contains('close')) {
        const currentImage = event.target.parentNode;
        const src = currentImage.querySelector('img').getAttribute('src');
        this.images.forEach((item) => {
          if (src === item.url) {
            this.images.delete(item);
          }
        });
        this.imagesContainer.removeChild(currentImage);
        this.save();
      }
    });
  }

  save() {
    localStorage.gallery = JSON.stringify(Array.from(this.images));
  }

  load() {
    this.images = new Set(JSON.parse(localStorage.gallery));
  }
}
