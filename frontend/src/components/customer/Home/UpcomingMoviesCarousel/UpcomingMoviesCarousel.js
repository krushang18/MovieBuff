import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star, Clock, Ticket } from 'lucide-react';
import './UpcomingMoviesCarousel.css'; 
import movieService from '../../../../services/movieService';

function UpcomingMoviesCarousel() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const [itemsToShow, setItemsToShow] = useState(3);

  const navigate = useNavigate();
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsToShow(1);
      } else if (window.innerWidth < 1024) {
        setItemsToShow(2);
      } else {
        setItemsToShow(3);
      }
    };
    
    // Set initial value
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        let data = await movieService.getUpcomingMovies();
        
        // Remove duplicate movies by ID
        const uniqueMovies = [];
        const movieIds = new Set();
        
        data.forEach(movie => {
          if (!movieIds.has(movie.id)) {
            movieIds.add(movie.id);
            uniqueMovies.push(movie);
          }
        });
        
        setMovies(uniqueMovies);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchMovies();
  }, []);

  const handleCardClick = (movieId) => {
    navigate(`/customer/movie-detail/${movieId}`);
  };
  
  const nextSlide = () => {
    setCurrentIndex(prevIndex => {
      const nextIndex = prevIndex + 1;
      return nextIndex >= movies.length - itemsToShow + 1 ? 0 : nextIndex;
    });
  };
  
  const prevSlide = () => {
    setCurrentIndex(prevIndex => {
      if (prevIndex === 0) return Math.max(0, movies.length - itemsToShow);
      return prevIndex - 1;
    });
  };
  
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="error-container">
        <p>Error: {error}</p>
      </div>
    );
  }
  
  const showNavigation = movies.length > itemsToShow;
  
  const visibleMovies = [];
  const visibleIds = new Set();
  
  let count = 0;
  let index = currentIndex;
  
  while (count < itemsToShow && count < movies.length) {
    const circularIndex = index % movies.length;
    const movie = movies[circularIndex];
    
    if (!visibleIds.has(movie.id)) {
      visibleIds.add(movie.id);
      visibleMovies.push(movie);
      count++;
    }
    
    index++;
    
    // Safety check to prevent infinite loop if there aren't enough unique movies
    if (index - currentIndex >= movies.length * 2) break;
  }
  
  return (
    <div className="upcoming-movie-carousel-page">
      <div className="carousel-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Upcoming Movies</h2>
            {/* <a href="/movies" className="view-all-link">
              View All <ChevronRight className="h-4 w-4" />
            </a> */}
          </div>
          
          <div className="carousel-container">
            {showNavigation && (
              <button 
                onClick={prevSlide}
                className="carousel-nav-button carousel-prev-button"
                aria-label="Previous movies"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            )}
            
            <div className="upcoming-movie-grid">
              {visibleMovies.map((movie) => (
                <div key={movie.id} className="upcoming-movie-card">
                  <div className="upcoming-movie-poster-container">
                    <img 
                      src={movie.posterUrl || '/api/placeholder/300/450'} 
                      alt={movie.title}
                      onClick={() => handleCardClick(movie.id)}
                      className="upcoming-movie-poster"
                    />
                    {movie.rating?.average && (
                      <div className="upcoming-movie-rating-badge">
                        <Star className="h-3 w-3" />
                        <span>{movie.rating.average.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  <div className="upcoming-movie-info">
                    <h3 className="upcoming-movie-title">{movie.title}</h3>
                    <div className="upcoming-movie-meta">
                      <div className="upcoming-movie-meta-item">
                        <Clock className="h-3 w-3" />
                        <span>{movie.duration ? formatDuration(movie.duration) : 'N/A'}</span>
                      </div>
                      {movie.releaseDate && (
                        <>
                          <span className="upcoming-movie-meta-separator">•</span>
                          <span>{new Date(movie.releaseDate).getFullYear()}</span>
                        </>
                      )}
                    </div>
                    <div className="upcoming-movie-genres">
                      {movie.genres?.slice(0, 2).map((genre, idx) => (
                        <span key={idx} className="upcoming-movie-genre-tag">
                          {genre}
                        </span>
                      ))}
                    </div>
                    <button 
                      onClick={() => navigate('/customer/theaters/movie/' + movie.id)}
                      className="book-now-button"
                    >
                      <Ticket className="h-4 w-4" />
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {showNavigation && (
              <button 
                onClick={nextSlide}
                className="carousel-nav-button carousel-next-button"
                aria-label="Next movies"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpcomingMoviesCarousel;