const API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxY2RmN2QxZTRiYzQwNDljMWU0ZmIzNTkyNDc2M2JjYyIsIm5iZiI6MTc2MTI5NjgwNy41MTcsInN1YiI6IjY4ZmI0MWE3NWFmMTg3MDQxZjk3Yzc0NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.5YY2heYOTbuBRxtVuFuDn8I_CH41ceGz17qTeoSaq4g';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

const moviesGrid = document.getElementById('moviesGrid');
const loading = document.getElementById('loading');
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const categoryTitle = document.getElementById('categoryTitle');
const categoryButtons = document.querySelectorAll('[data-category]');

const options = {
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
};

loadMovies('popular');

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
  categoryTitle.textContent = category === 'popular' ? 'Popular Movies' : 'Top Rated Movies';
  
  try {
    const res = await fetch(`${BASE_URL}/movie/${category}?language=en-US&page=1`, options);
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
    const res = await fetch(`${BASE_URL}/search/movie?query=${query}&language=en-US&page=1`, options);
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
    const year = movie.release_date ? new Date(movie.release_date).getFullYear() : '';
    
    return `
      <div class="col">
        <div class="card bg-dark text-white h-100 movie-card" onclick="showDetails(${movie.id})">
          <div class="position-relative">
            <img src="${poster}" class="card-img-top" alt="${movie.title}">
            <span class="movie-rating text-warning">
              <i class="bi bi-star-fill"></i> ${rating}
            </span>
          </div>
          <div class="card-body">
            <h6 class="card-title">${movie.title}</h6>
            <p class="card-text text-muted small">${year}</p>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

async function showDetails(id) {
  try {
    const res = await fetch(`${BASE_URL}/movie/${id}?language=en-US`, options);
    const movie = await res.json();
    
    const backdrop = movie.backdrop_path 
      ? `${IMAGE_BASE_URL}/original${movie.backdrop_path}`
      : './assets/Placeholder_movie_backdrop.jpg';
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
    const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : '';
    const genres = movie.genres.map(g => g.name).join(', ');
    
    document.getElementById('modalTitle').textContent = movie.title;
    document.getElementById('modalBody').innerHTML = `
      <img src="${backdrop}" class="img-fluid rounded mb-3" alt="${movie.title}">
      <p><strong>Rating:</strong> <span class="text-warning">${rating}/10</span></p>
      <p><strong>Release:</strong> ${movie.release_date || 'N/A'}</p>
      <p><strong>Runtime:</strong> ${runtime}</p>
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