// src/components/customer/CustomerApp.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CustomerLayout from './Layout/CustomerLayout';
import Home from './Home/Home';

// Import customer-specific components
// import CustomerDashboard from './Dashboard/CustomerDashboard';
// import MovieList from './Movie/MovieList';
// import MovieDetails from './Movie/MovieDetails';
// import BookingPage from './Booking/BookingPage';
// import BookingHistory from './Booking/BookingHistory';
// import BookingConfirmation from './Booking/BookingConfirmation';
// import PaymentPage from './Payment/PaymentPage';
// import ProfilePage from './Profile/ProfilePage';
import TheaterList from './Theatre/TheatreList/TheatreList';
import TheatreDetails from './Theatre/TheatreDetails/TheatreDetails';
import Booking from './Theatre/Booking/Booking';
import TheatreListOnMovies from './Theatre/TheatreListOnMovies/TheatreListOnMovies';
// import ReviewsPage from './Reviews/ReviewsPage';
// import ActorProfile from './Actor/ActorProfile';
import Layout from './Layout/Layout';

const CustomerApp = () => {
  return (
    <CustomerLayout>

       <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/" element={<Navigate to="/customer/dashboard" replace />} />
        <Route path="/dashboard" element={<CustomerDashboard />} />
        
        Movie Routes  */}
        {/* <Route path="/movies" element={<MovieList />} />
        <Route path="/movies/:id" element={<MovieDetails />} /> */}
        
        {/* Theater Routes  */}
        <Route path="/theaters" element={<TheaterList/>} />
        <Route path="/theaters/movie/:id" element={<TheatreListOnMovies/>} />
        <Route path="/theater/:theatreId" element={<TheatreDetails />} />
        <Route path="/booking/:showId" element={<Booking />} />
        
        {/* Booking Routes  */}
        {/* <Route path="/booking/:showId" element={<BookingPage />} />
        <Route path="/booking/confirm/:bookingId" element={<BookingConfirmation />} />
        <Route path="/booking/history" element={<BookingHistory />} />
        <Route path="/booking/payment/:bookingId" element={<PaymentPage />} /> */}
        
         {/* User Profile  */}
        {/* <Route path="/profile" element={<ProfilePage />} /> */}
        
         {/* Reviews  */}
        {/* <Route path="/reviews" element={<ReviewsPage />} /> */}
        
        {/* Actor Profile 
        <Route path="/actors/:id" element={<ActorProfile />} /> */}
      </Routes>
    </CustomerLayout>
  );
};

export default CustomerApp;