const Base_URL = "https://movie-list.alphacamp.io"
const Index_URL =Base_URL + "/api/v1/movies/"
const Poster_URL =Base_URL + "/posters/"


let movies = JSON.parse( localStorage.getItem('favoriteMovies'))
let filteredMovies  = []

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

// Listen searchForm click function



// Listen dataPanel click function
dataPanel.addEventListener('click',function onPanelClicked(event){
if(event.target.matches('.btn-show-movie')){
showMovieModal(Number(event.target.dataset.id))
}  

else if (event.target.matches('.btn-del-favorite')){
console.log(event.target.dataset.id);
  removeToFavorite(Number(event.target.dataset.id))
}
})

//Function delete the movie into localStorage
function removeToFavorite(id){
if(!movies)
return

const movieIndex = movies.findIndex((movie) => movie.id === id)
if(movieIndex === -1) return

movies.splice(movieIndex,1)

localStorage.setItem('favoriteMovies',JSON.stringify(movies))

renderMovieList(movies)
}

// Function  Collect Favorite Movie data load into localStorage
function addToFavorite(id){
const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
const movie = movies.find((movie) => movie.id === id)

if(list.some( (movie) => movie.id === id)){
  return alert('You already put the same thing')
}
list.push(movie)
localStorage.setItem('favoriteMovies',JSON.stringify(list))


}

// Print We need information in the Page
function renderMovieList(data){
let rawHTML = ''
data.forEach(item => {
  rawHTML +=`
<div class="col-3">
        <div class="mb-2">
          <div class="card">
            <img
              src=${Poster_URL + item.image}
              class="card-img-top" alt="Movie Poster" />
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-target="#movie-modal" data-toggle="modal"
              data-id=${item.id}>More</button>
              <button class="btn btn-info btn-del-favorite" data-id=${item.id}> X </button>
            </div>
          </div>
        </div>
</div>
`
})
dataPanel.innerHTML = rawHTML
}


// Modal data function
function showMovieModal(id){
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

renderMovieList(movies)


