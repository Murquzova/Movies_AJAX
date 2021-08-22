// https://www.omdbapi.com/?apikey=2c9d65d5&s=Matrix

let searchForm = document.forms.searchForm;
let result = document.getElementById('result');
let detailsModal = document.querySelector('#detailsModal');
searchForm.addEventListener('submit', onSearch);

let apiUrl = 'https://www.omdbapi.com/';
let apiKey = '2c9d65d5';

let searchResult = [];
let page = 1;
function onSearch() {
  event.preventDefault();

  let searchText = searchForm.search.value;

  // делаем запром на api следующим способом
  let httpRequest = new XMLHttpRequest();
  httpRequest.onload = onApiResponse;
  httpRequest.open('GET', `${apiUrl}?apikey=${apiKey}&s=${searchText}  `);
  httpRequest.send();
  // searchForm.reset();
  result.innerHTML = '';
  // console.log(httpRequest.response);
}

window.addEventListener('scroll', onScroll);
function onScroll() {
  let scroll = window.scrollY;
  let windowHeight = document.documentElement.clientHeight;

  if (document.body.clientHeight - (window.scrollY + windowHeight) < 0) {
    page++;
    nextSearch(page);
  }
}

function nextSearch(page) {
  let searchText = searchForm.search.value;

  // делаем запром на api чтоб при скроле приходил следующим способом
  let httpRequest = new XMLHttpRequest();
  httpRequest.onload = onApiResponse;
  httpRequest.open(
    'GET',
    `${apiUrl}?apikey=${apiKey}&s=${searchText}&page=${page}`
  );
  httpRequest.send();
}

// Метод HTMLFormElement.reset() восстанавливает стандартные значения всем элементам формы.

function onApiResponse() {
  let data = JSON.parse(event.target.response);
  let searchResult = data.Search;
  searchResult.forEach((item) => {
    createMovie(item);
  });
}

function createMovie(movie) {
  let template = `
   <div class="col-md-4 mb-4" >
  <div class="card">
  <img src=${movie.Poster} class="card-img-top" alt="...">
  <div class="card-body">
    <h5 class="card-title">${movie.Title}</h5>
    <p class="card-text">${movie.Year}</p>
    <button data-id=${movie.imdbID} onclick='detailsClick()' type='button' data-bs-toggle="modal" data-bs-target="#detailsModal" class="btn btn-primary">Details</button>
  </div>
</div>
</div> `;

  // insertAdjacentHTML вставляет указывая позицию внутри
  result.insertAdjacentHTML('beforeend', template);
}

function detailsClick() {
  let id = event.target.getAttribute('data-id');
  // console.log(id);
  let httpRequest = new XMLHttpRequest();
  httpRequest.onload = onDetailsResponse;
  httpRequest.open('GET', `${apiUrl}?apikey=${apiKey}&i=${id}`);
  httpRequest.send();
}

function onDetailsResponse() {
  let data = JSON.parse(event.target.response);
  detailsModal.querySelector('.modal-title').innerHTML = data.Title;
}
