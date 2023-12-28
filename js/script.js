const moviesEl = document.querySelector('.movies')
const formEl = document.querySelector('form')
const inputEl = document.querySelector('input')
const basketCount = document.querySelector('.count')
const basketBtnIconEl = document.querySelector('.favourite-btn i')
const basketMoviesEl = document.querySelector('.basket-movies')
const basketMoviesContentEl = document.querySelector('.basket-movies-content')
const emptyBasketEl = document.querySelector('.emtpy-basket')

const getOmdbApi = movieName =>
	`https://www.omdbapi.com/?s=${movieName}&apikey=9446507`

let basketItems = []
let movies = []

let lastItemInBasket = null

function fetchMovies(movieName = 'Shrek') {
	fetch(getOmdbApi(movieName))
		.then(res => res.json())
		.then(data => {
			renderMovies(data.Search)
			movies = data.Search
		})
}

function renderMovies(movies = []) {
	moviesEl.innerHTML = ''
	movies.map(item => {
		moviesEl.innerHTML += `
        <div class='card'>
          <a href='./movie-details.html?movie=${item.imdbID}'>
            <img src="${item.Poster}" alt="Movie">
          </a>

          <div class='card-body'>
            <div class="card-body-header">
              <h3>${item.Title}</h3>
              <button onclick="addToBasket('${item.imdbID}')">
                ${
									basketItems.find(
										basketItem => basketItem.imdbID === item.imdbID
									)
										? `<i class="bx bxs-star ${
												lastItemInBasket?.imdbID === item.imdbID
													? 'animate'
													: ''
										  }"></i>`
										: `<i class="bx bx-star"></i>`
								}
              </button>
            </div>
            <div class='movie-info'>
              <h4>Year: ${item.Year}</h4>
              <h4>${item.Type}</h4>
            </div>
          </div>
        </div>
    `
	})
}

function addToBasket(id) {
	const currMovie = movies.find(item => item.imdbID === id)

	const indexInBasket = basketItems.findIndex(item => item.imdbID === id)

	if (indexInBasket === -1) {
		basketItems = [currMovie, ...basketItems]
		lastItemInBasket = currMovie
	} else {
		basketItems = basketItems.filter(item => item.imdbID !== id)
		lastItemInBasket = null
	}

	renderMovies(movies)
	renderBasketMovies(basketItems)
	changeBasketCount(basketItems.length)
	checkBasketNotFound()
}

function changeBasketCount(count) {
	basketCount.innerHTML = count
	if (count === 0) {
		basketBtnIconEl.classList.remove('bxs-star')
	} else {
		basketBtnIconEl.classList.add('bxs-star')
	}
}

function toggleBasketModal() {
	lastItemInBasket = null
	basketMoviesEl.classList.toggle('active')
	renderBasketMovies(basketItems)

	checkBasketNotFound()
}

function checkBasketNotFound() {
	if (!basketItems.length) {
		emptyBasketEl.classList.add('active')
	} else {
		emptyBasketEl.classList.remove('active')
	}
}

function renderBasketMovies(basketMovies) {
	basketMoviesContentEl.innerHTML = ''
	basketMovies.map(item => {
		basketMoviesContentEl.innerHTML += `
    <div class='card'>
      <a href='./movie-details.html?movie=${item.imdbID}'>
        <img src="${item.Poster}" alt="Movie">
      </a>

      <div class='card-body'>
        <div class="card-body-header">
          <h3>${item.Title}</h3>
          <button onclick="addToBasket('${item.imdbID}')">
            ${
							basketItems.find(basketItem => basketItem.imdbID === item.imdbID)
								? `<i class="bx bxs-star ${
										lastItemInBasket?.imdbID === item.imdbID ? 'animate' : ''
								  }"></i>`
								: `<i class="bx bx-star"></i>`
						}
          </button>
        </div>
        <div class='movie-info'>
          <h4>Year: ${item.Year}</h4>
          <h4>${item.Type}</h4>
        </div>
      </div>
    </div>
    `
	})
}

formEl.onsubmit = event => {
	event.preventDefault()
	fetchMovies(inputEl.value)
}
fetchMovies()

// iqlas
