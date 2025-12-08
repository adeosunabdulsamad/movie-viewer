const API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxY2RmN2QxZTRiYzQwNDljMWU0ZmIzNTkyNDc2M2JjYyIsIm5iZiI6MTc2MTI5NjgwNy41MTcsInN1YiI6IjY4ZmI0MWE3NWFmMTg3MDQxZjk3Yzc0NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.5YY2heYOTbuBRxtVuFuDn8I_CH41ceGz17qTeoSaq4g';
const BASE_URL = 'https://api.themoviedb.org/3';
let LOAD_URL = 'https://api.themoviedb.org/3/movie';
let SEARCH_URL = 'https://api.themoviedb.org/3/search/movie';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

const moviesGrid = document.getElementById('moviesGrid');
const loading = document.getElementById('loading');
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const categoryTitle = document.getElementById('categoryTitle');
const categoryButtons = document.querySelectorAll('[data-category]');
const searchParam = document.getElementById('search_param');
const seriesMovies = document.getElementById('series_movies');
const options = {
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
};

const currentUser = JSON.parse(localStorage.getItem('currentUser'));
const userSection = document.getElementById('userSection');

if (!currentUser) {
  window.location.href = 'auth.html';
} else {
  userSection.innerHTML = `
    <span class="text-white me-3">${currentUser.name}</span>
    <button class="btn btn-sm btn-outline-danger" id="logoutBtn">
      <i class="bi bi-box-arrow-right"></i> Logout
    </button>
  `;
  
  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    window.location.href = 'auth.html';
  });
}

loadMovies('popular');

 searchParam.addEventListener('change', function() {
        searchInput.placeholder = `Search for ${searchParam.value}......`;
        SEARCH_URL = `https://api.themoviedb.org/3/search/${searchParam.value}`;
        LOAD_URL = `https://api.themoviedb.org/3/${searchParam.value}`;
        seriesMovies.textContent = searchParam.value;
        // categoryTitle.textContent = category === 'popular' ? `Popular ${searchParam.value}s` : `Top Rated ${searchParam.value}s`;
    });
categoryButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const category = btn.dataset.category;
    loadMovies(category);
    categoryButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (query) searchMovies(query);
});

async function loadMovies(category) {
  loading.style.display = 'block';
  moviesGrid.innerHTML = '';
  categoryTitle.textContent = category === 'popular' ? `Popular ${searchParam.value} shows` : `Top Rated ${searchParam.value} shows`;
  
  try {
    const res = await fetch(`${LOAD_URL}/${category}?language=en-US&page=1`, options);
    const data = await res.json();
    displayMovies(data.results);
  } catch (err) {
    console.error(err);
    moviesGrid.innerHTML = '<div class="col-12 text-center text-danger">Failed to load movies</div>';
  } finally {
    loading.style.display = 'none';
  }
}

async function searchMovies(query) {
  loading.style.display = 'block';
  moviesGrid.innerHTML = '';
  categoryTitle.textContent = `Search: "${query}"`;
  
  try {
    const res = await fetch(`${SEARCH_URL}?query=${query}&language=en-US&page=1`, options);
    const data = await res.json();
    displayMovies(data.results);
  } catch (err) {
    console.error(err);
    moviesGrid.innerHTML = '<div class="col-12 text-center text-danger">Search failed</div>';
  } finally {
    loading.style.display = 'none';
  }
}

function displayMovies(movies) {
  if (!movies || movies.length === 0) {
    moviesGrid.innerHTML = '<div class="col-12 text-center text-white">No movies found</div>';
    return;
  }
  
  moviesGrid.innerHTML = movies.map(movie => {
    const poster = movie.poster_path 
      ? `${IMAGE_BASE_URL}/w500${movie.poster_path}`
      : './assets/Placeholder_movie_poster.jpg';
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
    const releaseDate = movie.release_date || movie.first_air_date || '';
    const year = releaseDate ? new Date(releaseDate).getFullYear() : '';
    const movieName = movie.title || movie.name;
    const type = movie.title ? 'movie' : 'tv';
    
    return `
      <div class="col">
        <div class="card bg-dark text-white h-100 movie-card" 
             data-movie-id="${movie.id}" 
             data-movie-type="${type}"
             onclick="showDetails(${movie.id}, '${type}')">
          <div class="position-relative movie-poster-container">
            <img src="${poster}" class="card-img-top movie-poster" alt="${movieName}">
            <div class="trailer-overlay" style="display: none;">
              <iframe class="trailer-iframe" 
                      frameborder="0" 
                      allow="autoplay; encrypted-media" 
                      allowfullscreen>
              </iframe>
            </div>
            <span class="movie-rating text-warning">
              <i class="bi bi-star-fill"></i> ${rating}
            </span>
          </div>
          <div class="card-body">
            <h6 class="card-title">${movieName}</h6>
            <p class="card-text text-muted small">${year}</p>
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  addHoverTrailerListeners();
}

async function showDetails(id) {
  try {
    const res = await fetch(`${LOAD_URL}/${id}?language=en-US`, options);
    const movie = await res.json();
    
    const videosRes = await fetch(`${LOAD_URL}/${id}/videos?language=en-US`, options);
    const videosData = await videosRes.json();
    const trailer = videosData.results.find(vid => vid.type === 'Trailer' && vid.site === 'YouTube') 
      || videosData.results.find(vid => vid.site === 'YouTube');
    
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
    const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : '';
    const genres = movie.genres.map(g => g.name).join(', ');
    const title = movie.title || movie.name;
    
    document.getElementById('modalTitle').textContent = title;
    
    let mediaContent = '';
    if (trailer) {
      mediaContent = `
        <div class="ratio ratio-16x9 mb-3">
          <iframe src="https://www.youtube.com/embed/${trailer.key}" 
                  title="${title} Trailer" 
                  frameborder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowfullscreen>
          </iframe>
        </div>
      `;
    } else {
      const backdrop = movie.backdrop_path 
        ? `${IMAGE_BASE_URL}/original${movie.backdrop_path}`
        : './assets/Placeholder_movie_backdrop.jpg';
      mediaContent = `<img src="${backdrop}" class="img-fluid rounded mb-3" alt="${title}">`;
    }
    
    document.getElementById('modalBody').innerHTML = `
      ${mediaContent}
      <p><strong>Rating:</strong> <span class="text-warning">${rating}/10</span></p>
      <p><strong>Release:</strong> ${movie.release_date || movie.first_air_date || 'N/A'}</p>
      <p><strong>Runtime:</strong> ${runtime || 'couple of years'}</p>
      <p><strong>Genres:</strong> ${genres}</p>
      <p><strong>Overview:</strong><br>${movie.overview || 'No overview available.'}</p>
    `;

    const modal = new window.bootstrap.Modal(document.getElementById('movieModal'));
    modal.show();
  } catch (err) {
    console.error(err);
    alert('Calm down, I am working on It!');
  }
}

function addHoverTrailerListeners() {
  const movieCards = document.querySelectorAll('.movie-card');
  const trailerCache = {};
  
  movieCards.forEach(card => {
    let hoverTimer = null;
    const movieId = card.dataset.movieId;
    const movieType = card.dataset.movieType;
    const posterContainer = card.querySelector('.movie-poster-container');
    const poster = card.querySelector('.movie-poster');
    const trailerOverlay = card.querySelector('.trailer-overlay');
    const trailerIframe = card.querySelector('.trailer-iframe');
    
    card.addEventListener('mouseenter', async () => {
      hoverTimer = setTimeout(async () => {
        if (!trailerCache[movieId]) {
          try {
            const videosRes = await fetch(`${BASE_URL}/${movieType}/${movieId}/videos?language=en-US`, options);
            const videosData = await videosRes.json();
            const trailer = videosData.results.find(vid => vid.type === 'Trailer' && vid.site === 'YouTube') 
              || videosData.results.find(vid => vid.site === 'YouTube');
            
            trailerCache[movieId] = trailer ? trailer.key : null;
          } catch (err) {
            console.error('Failed to load trailer:', err);
            trailerCache[movieId] = null;
          }
        }
        
        if (trailerCache[movieId]) {
          trailerIframe.src = `https://www.youtube.com/embed/${trailerCache[movieId]}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailerCache[movieId]}`;
          poster.style.opacity = '0';
          trailerOverlay.style.display = 'block';
        }
      }, 500);
    });
    
    card.addEventListener('mouseleave', () => {
      clearTimeout(hoverTimer);
      trailerIframe.src = '';
      poster.style.opacity = '1';
      trailerOverlay.style.display = 'none';
    });
  });
}