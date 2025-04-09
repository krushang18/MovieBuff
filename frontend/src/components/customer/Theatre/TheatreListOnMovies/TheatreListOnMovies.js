import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { selectUserCity } from '../../../../redux/slices/locationSlice';
import './TheatreListOnMovies.css';

export default function TheatreListOnMovies() {
  const [theaters, setTheaters] = useState([]);
  const [showsByTheater, setShowsByTheater] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [movieDetails, setMovieDetails] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Get the id parameter from the URL
  const { id } = useParams();
  const userCity = useSelector(selectUserCity);
  const navigate = useNavigate();
  
  // Function to fetch theaters and shows for the specific movie
  const fetchTheatersAndShowsForMovie = async () => {
    try {
      setLoading(true);
      
      // For movie-specific theaters, use the shows controller endpoint for movie and city
      const apiUrl = `http://localhost:8080/api/shows/movie/${id}/city/${userCity}`;
      
      // Fetch movie details
      try {
        const movieResponse = await fetch(`http://localhost:8080/api/movies/${id}`);
        if (movieResponse.ok) {
          const movieData = await movieResponse.json();
          setMovieDetails(movieData);
        }
      } catch (movieErr) {
        console.error('Error fetching movie details:', movieErr);
      }
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error('Failed to fetch theaters and shows');
      }
      
      const showsData = await response.json();
      
      // The response will be a list of shows, so we need to extract unique theaters
      const theaterMap = new Map();
      const showsMap = {};
      
      // For each show, get the theater details and group shows by theater
      for (const show of showsData) {
        if (!theaterMap.has(show.theaterId)) {
          // Fetch theater details
          try {
            const theaterResponse = await fetch(`http://localhost:8080/api/theaters/${show.theaterId}`);
            if (theaterResponse.ok) {
              const theaterData = await theaterResponse.json();
              theaterMap.set(show.theaterId, theaterData);
            }
          } catch (err) {
            console.error(`Error fetching theater ${show.theaterId}:`, err);
          }
        }
        
        // Group shows by theater ID
        if (!showsMap[show.theaterId]) {
          showsMap[show.theaterId] = [];
        }
        
        // Add show to the theater's show list
        showsMap[show.theaterId].push(show);
      }
      
      // Convert map to array
      const theatersData = Array.from(theaterMap.values());
      setTheaters(theatersData);
      setShowsByTheater(showsMap);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching theaters and shows:', err);
      setError(err.message);
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (userCity && id) {
      fetchTheatersAndShowsForMovie();
    } else {
      setError('Please select a location to view theaters');
      setLoading(false);
    }
  }, [userCity, id]);

  const handleShowClick = (showId) => {
    navigate(`/customer/booking/${showId}`);
  };
  
  const renderAmenities = (amenities) => {
    if (!amenities || amenities.length === 0) return null;
    
    return (
      <div className="movie-theater-amenities">
        {amenities.map((amenity, index) => (
          <span key={index} className="movie-amenity-badge">
            {amenity}
          </span>
        ))}
      </div>
    );
  };
  
  const getTicketStatusClass = (status) => {
    switch(status) {
      case 'AVAILABLE':
        return 'ticket-status-available';
      case 'FILLING_FAST':
        return 'ticket-status-filling-fast';
      case 'FEW_SEATS_LEFT':
        return 'ticket-status-few-seats';
      case 'SOLD_OUT':
        return 'ticket-status-sold-out';
      default:
        return 'ticket-status-available';
    }
  };
  
  const getTicketStatus = (show) => {
    // This is a placeholder function - in a real app, you'd calculate this based on seat availability
    // For now, we'll simulate various statuses
    const availableSeats = show.availableSeats || 0;
    const totalSeats = show.totalSeats || 100;
    const percentage = (availableSeats / totalSeats) * 100;
    
    if (percentage <= 0) return 'SOLD_OUT';
    if (percentage < 10) return 'FEW_SEATS_LEFT';
    if (percentage < 40) return 'FILLING_FAST';
    return 'AVAILABLE';
  };

  const formatShowTime = (dateTimeString) => {
    if (!dateTimeString) return '';
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };
  
  

  if (loading) {
    return (
      <div className="movie-theater-list-container">
        <div className="movie-theater-loading">
          <div className="movie-loading-spinner"></div>
          <p>Loading theaters...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="movie-theater-list-container">
        <div className="movie-theater-error">
          <h3>Oops!</h3>
          <p>{error}</p>
          <button 
            className="movie-change-location-btn" 
            onClick={() => navigate('/customer/select-location')}
          >
            Change Location
          </button>
        </div>
      </div>
    );
  }

  if (theaters.length === 0) {
    return (
      <div className="movie-theater-list-container">
        <div className="movie-no-theaters">
          <h3>No theaters showing {movieDetails?.title || 'this movie'} in {userCity}</h3>
          <p>There are no theaters currently showing this movie in your selected location.</p>
          <div className="movie-no-theaters-actions">
            <button 
              className="movie-change-location-btn" 
              onClick={() => navigate('/customer/select-location')}
            >
              Change Location
            </button>
            <button 
              className="movie-view-all-theaters-btn" 
              onClick={() => navigate('/customer/theatres')}
            >
              View All Theaters
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="movie-theater-list-container">
      <div className="movie-theater-list-header">
        <h2>
          Theaters showing 
          <span className="movie-title"> {movieDetails?.title || 'this movie'} </span> 
          in <span className="movie-city-name">{userCity}</span>
        </h2>
        <div className="movie-header-actions">
          <button 
            className="movie-change-location-btn" 
            onClick={() => navigate('/customer/select-location')}
          >
            Change Location
          </button>
          <button 
            className="movie-view-all-theaters-btn" 
            onClick={() => navigate('/customer/theatres')}
          >
            View All Theaters
          </button>
        </div>
      </div>
      
      <div className="movie-legend">
        <div className="legend-item">
          <span className="legend-indicator available"></span>
          <span>AVAILABLE</span>
        </div>
        <div className="legend-item">
          <span className="legend-indicator filling-fast"></span>
          <span>FILLING FAST</span>
        </div>
        <div className="legend-item">
          <span className="legend-indicator few-seats"></span>
          <span>FEW SEATS LEFT</span>
        </div>
        <div className="legend-item">
          <span className="legend-indicator sold-out"></span>
          <span>SOLD OUT</span>
        </div>
      </div>
      
      <div className="movie-theaters-list">
        {theaters.map((theater) => (
          <div 
            key={theater.id} 
            className="movie-theater-card"
          >
            <div className="movie-theater-card-header">
              <h3 className="movie-theater-name">{theater.name}</h3>
              <span className={`movie-theater-status ${theater.status === 'ACTIVE' ? 'active' : 'inactive'}`}>
                {theater.status}
              </span>
            </div>
            
            <div className="movie-theater-location">
              {theater.location && (
                <>
                  <p>{theater.location.address}</p>
                  <p>{theater.location.city}, {theater.location.state} {theater.location.zipCode}</p>
                  {theater.location.googleLink && (
                    <a 
                      href={theater.location.googleLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="movie-google-maps-link"
                    >
                      View on Google Maps
                    </a>
                  )}
                </>
              )}
            </div>
            
            <div className="movie-theater-info">
              <div className="movie-theater-details">
                <div className="movie-detail-item">
                  <span className="movie-detail-label">Screens:</span>
                  <span className="movie-detail-value">{theater.totalScreens || (theater.screens && theater.screens.length) || 0}</span>
                </div>
                <div className="movie-detail-item">
                  <span className="movie-detail-label">Contact:</span>
                  <span className="movie-detail-value">{theater.phoneNumber || 'N/A'}</span>
                </div>
              </div>
              
              {renderAmenities(theater.amenities)}
            </div>
            
            <div className="movie-show-times-section">
              <h4>Show Times</h4>
              
              {showsByTheater[theater.id] && showsByTheater[theater.id].length > 0 ? (
                <div className="movie-show-times">
                  {showsByTheater[theater.id].map(show => {
                    const ticketStatus = getTicketStatus(show);
                    return (
                      <button 
                        key={show.id}
                        className={`movie-show-time ${getTicketStatusClass(ticketStatus)}`}
                        onClick={() => handleShowClick(show.id)}
                        disabled={ticketStatus === 'SOLD_OUT'}
                      >
                        <span className="time">{formatShowTime(show.showTime)}</span>
                        <span className="experience-tag">{show.experience || '2D'}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="no-shows-message">No shows available for this date</p>
              )}
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
}