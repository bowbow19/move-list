const Base_URL = "https://movie-list.alphacamp.io"
const Index_URL = Base_URL + "/api/v1/movies/"
const Poster_URL = Base_URL + "/posters/"
const Movies_Per_Page = 4

let movies = []
let filteredMovies = []

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginationList = document.querySelector('#pagination')


// Lister pagination
paginationList.addEventListener('click', function onPaginationClicked(event) {
  if (event.target.tagName !== 'A') return

  const page = Number(event.target.dataset.page)
  console.log(page);
  renderMovieList(getMoviesPage(page))
})

// Listen searchForm click function
searchForm.addEventListener('submit', function onSearchSubmitted(event) {
  event.preventDefault()

  const keyword = searchInput.value.trim().toLowerCase()

  if (!keyword.length) {
    return alert('Please print data')
  }

  // Solution First :Using  for..of & includes
  // for(const movie of movies){
  //   if(movie.title.toLowerCase().includes(keyword)){
  //     filteredMovies.push(movie)
  //   }
  // }
  //Solution Two : Using filter
  filteredMovies = movies.filter(movie => movie.title.toLowerCase().includes(keyword))
  
  console.log(filteredMovies);


  getPagination(filteredMovies.length)
  renderMovieList(getMoviesPage(1))
})

// Listen dataPanel click function
dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (data = event.target.matches('.btn-show-movie')) {
    showMovieModal(event.target.dataset.id)
  } else if (event.target.matches('.btn-add-favorite')) {
    console.log(event.target.dataset.id);
    addToFavorite(Number(event.target.dataset.id))
  }
})

// Function getPagination
function getPagination(amount) {

  const pageNumber = Math.ceil(amount / Movies_Per_Page)
  console.log(pageNumber);
  let rawHtml = ""
  for (let page = 1; page <= pageNumber; page++) {
    rawHtml += `
        <li class="page-item"><a class="page-link" href="#" data-page=${page}>${page}</a></li>
  `
  }
  paginationList.innerHTML = rawHtml
}

// Function getMoviesByPage  
function getMoviesPage(page) {

  const data = filteredMovies.length ? filteredMovies : movies
  const startIndex = (page - 1) * Movies_Per_Page

  return data.slice(startIndex, startIndex + Movies_Per_Page)

}

// Function  Collect Favorite Movie data load into localStorage
function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find((movie) => movie.id === id)

  if (list.some((movie) => movie.id === id)) {
    return alert('You already put the same thing')
  }
  list.push(movie)
  localStorage.setItem('favoriteMovies', JSON.stringify(list))


}

// Print We need information in the Page
function renderMovieList(data) {
  let rawHTML = ''
  data.forEach(item => {
    rawHTML += `
<div class="col-3">
        <div class="mb-2">
          <div class="card">
            <img src=${Poster_URL + item.image} class="card-img-top" alt="Movie Poster" />
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-target="#movie-modal" data-toggle="modal"
              data-id=${item.id}>More</button>
              <button class="btn btn-info btn-add-favorite" data-id=${item.id}>favorite</button>
            </div>
          </div>
        </div>
</div>
`
  })
  dataPanel.innerHTML = rawHTML
}


// Modal data function
function showMovieModal(id) {
  const movietitle = document.querySelector('#movie-modal-title')
  const movieimage = document.querySelector('#movie-model-image')
  const moviedate = document.querySelector('#movie-model-date')
  const moviedescription = document.querySelector('#movie-model-description')

  axios.get(Index_URL + id)
    .then(response => {
      const results = response.data.results
      movietitle.innerText = results.title
      moviedate.innerText = 'Release date: ' + results.release_date
      moviedescription.innerText = results.description
      movieimage.innerHTML = `
<img src="${Poster_URL + results.image}">
`
    })
}

// Print All movie data 
axios
  .get(Index_URL).then((response) => {
    movies.push(...response.data.results)
    getPagination(movies.length)
    renderMovieList(getMoviesPage(10))
  })
