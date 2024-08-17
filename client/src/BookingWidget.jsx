import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function BookingWidget({ place }) {
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [redirect, setRedirect] = useState('');

  let numberOfNights = 0;
  if (checkIn && checkOut) {
    numberOfNights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  }

  async function bookThisPlace() {
    const response = await fetch('/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        checkIn,
        checkOut,
        numberOfGuests,
        name,
        phone,
        place: place._id,
        price: numberOfNights * place.price,
      }),
    });
    const bookingId = await response.json();
    setRedirect(`/account/bookings/${bookingId}`);
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div className="bg-white shadow p-4 rounded-2xl">
      <div className="text-2xl text-center">
        Price: ${place.price} / per night
      </div>
      <div className="border rounded-2xl mt-4">
        <div className="flex">
          <div className="py-3 px-4 flex-1">
            <label>Check in:</label>
            <DatePicker
              selected={checkIn}
              onChange={dates => {
                const [start, end] = dates;
                setCheckIn(start);
                setCheckOut(end);
              }}
              startDate={checkIn}
              endDate={checkOut}
              selectsRange
              minDate={new Date()}
              className="form-input"
              placeholderText="Select check-in date"
            />
          </div>
          <div className="py-3 px-4 flex-1">
            <label>Check out:</label>
            <DatePicker
              selected={checkOut}
              onChange={date => setCheckOut(date)}
              startDate={checkIn}
              endDate={checkOut}
              minDate={checkIn || new Date()}
              selectsEnd
              className="form-input"
              placeholderText="Select check-out date"
            />
          </div>
        </div>
        <div className="py-3 px-4 border-t">
          <label>Number of guests:</label>
          <input
            type="number"
            value={numberOfGuests}
            onChange={ev => setNumberOfGuests(ev.target.value)}
          />
        </div>
        {numberOfNights > 0 && (
          <div className="py-3 px-4 border-t">
            <label>Your full name:</label>
            <input
              type="text"
              value={name}
              onChange={ev => setName(ev.target.value)}
            />
            <label>Phone number:</label>
            <input
              type="tel"
              value={phone}
              onChange={ev => setPhone(ev.target.value)}
            />
          </div>
        )}
      </div>
      <button onClick={bookThisPlace} className="primary mt-4">
        Book this place
        {numberOfNights > 0 && (
          <span> ${numberOfNights * place.price}</span>
        )}
      </button>
    </div>
  );
}
