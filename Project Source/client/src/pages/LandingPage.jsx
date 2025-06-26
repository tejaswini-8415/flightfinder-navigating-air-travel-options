import React, { useContext, useEffect, useState } from 'react';
import '../styles/LandingPage.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GeneralContext } from '../context/GeneralContext';

const LandingPage = () => {
  const [error, setError] = useState('');
  const [checkBox, setCheckBox] = useState(false);
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [Flights, setFlights] = useState([]);

  const { setTicketBookingDate } = useContext(GeneralContext);
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    const userType = localStorage.getItem('userType');
    if (userType === 'admin') navigate('/admin');
    else if (userType === 'flight-operator') navigate('/flight-admin');
  }, []);

  const fetchFlights = async () => {
    const today = new Date();

    if (checkBox) {
      if (departure && destination && departureDate && returnDate) {
        const dep = new Date(departureDate);
        const ret = new Date(returnDate);
        if (dep > today && ret > dep) {
          setError('');
          const res = await axios.get('http://localhost:6001/fetch-flights');
          setFlights(res.data);
        } else {
          setError('Please check the dates');
        }
      } else {
        setError('Please fill all the inputs');
      }
    } else {
      if (departure && destination && departureDate) {
        const dep = new Date(departureDate);
        if (dep >= today) {
          setError('');
          const res = await axios.get('http://localhost:6001/fetch-flights');
          setFlights(res.data);
        } else {
          setError('Please check the dates');
        }
      } else {
        setError('Please fill all the inputs');
      }
    }
  };

  const handleTicketBooking = (id, origin, destination) => {
    if (userId) {
      if (origin === departure) {
        setTicketBookingDate(departureDate);
      } else if (destination === departure) {
        setTicketBookingDate(returnDate);
      }
      navigate(`/book-flight/${id}`);
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="landingPage">
      <div className="landingHero">
        <div className="landingHero-title">
          <h1>Embark on an Extraordinary Flight Booking Adventure!</h1>
          <p>
            Unleash your travel desires and book extraordinary flight journeys
            to unforgettable destinations, igniting a sense of adventure like never before.
          </p>
        </div>

        <div className="Flight-search-container">
          <div className="form-check form-switch mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="returnSwitch"
              onChange={(e) => setCheckBox(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="returnSwitch">
              Return journey
            </label>
          </div>

          <div className="Flight-search-container-body">
            <div className="form-floating">
              <select
                className="form-select"
                value={departure}
                onChange={(e) => setDeparture(e.target.value)}
              >
                <option value="" disabled>Select</option>
                {cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              <label>From</label>
            </div>

            <div className="form-floating">
              <select
                className="form-select"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              >
                <option value="" disabled>Select</option>
                {cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              <label>To</label>
            </div>

            <div className="form-floating">
              <input
                type="date"
                className="form-control"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
              />
              <label>Journey Date</label>
            </div>

            {checkBox && (
              <div className="form-floating">
                <input
                  type="date"
                  className="form-control"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                />
                <label>Return Date</label>
              </div>
            )}

            <div>
              <button className="btn btn-primary" onClick={fetchFlights}>
                Search
              </button>
            </div>
          </div>

          {error && <p>{error}</p>}
        </div>

        {Flights.length > 0 && (
          <div className="availableFlightsContainer">
            <h1>Available Flights</h1>
            <div className="Flights">
              {Flights.filter((flight) => {
                const matchOneWay =
                  flight.origin === departure && flight.destination === destination;
                const matchReturn =
                  flight.origin === destination && flight.destination === departure;
                return checkBox ? matchOneWay || matchReturn : matchOneWay;
              }).map((flight) => (
                <div className="Flight" key={flight._id}>
                  <div>
                    <p><b>{flight.flightName}</b></p>
                    <p><b>Flight Number:</b> {flight.flightId}</p>
                  </div>
                  <div>
                    <p><b>From:</b> {flight.origin}</p>
                    <p><b>Departure:</b> {flight.departureTime}</p>
                  </div>
                  <div>
                    <p><b>To:</b> {flight.destination}</p>
                    <p><b>Arrival:</b> {flight.arrivalTime}</p>
                  </div>
                  <div>
                    <p><b>Price:</b> ₹{flight.basePrice}</p>
                    <p><b>Seats:</b> {flight.totalSeats}</p>
                  </div>
                  <button
                    className="btn btn-success"
                    onClick={() =>
                      handleTicketBooking(flight._id, flight.origin, flight.destination)
                    }
                  >
                    Book Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <section id="about" className="section-about">
        <div className="container">
          <h2>About Us</h2>
          <p>
            Welcome to our flight ticket booking app, where we are dedicated to providing you
            with an exceptional travel experience from start to finish. Whether you're commuting,
            planning an adventure, or exploring new destinations, we’ve got the flight for you.
          </p>
          <p>
            Our easy-to-use interface lets you explore schedules, compare fares, and book
            flights in just a few clicks. Customize your travel with seat selection, preferred
            times, and more.
          </p>
          <p>
            Embrace seamless travel and unforgettable journeys with our app—your perfect partner
            in the skies.
          </p>
          <span>
            <h5>2023 SB FlightConnect - &copy; All rights reserved</h5>
          </span>
        </div>
      </section>
    </div>
  );
};

const cities = [
  'Chennai',
  'Banglore',
  'Hyderabad',
  'Mumbai',
  'Indore',
  'Delhi',
  'Pune',
  'Trivendrum',
  'Bhopal',
  'Kolkata',
  'Varanasi',
  'Jaipur',
];

export default LandingPage;
