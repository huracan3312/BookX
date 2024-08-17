import { useContext, useEffect, useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { UserContext } from "./UserContext.jsx";

export default function BookingWidget({ place }) {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [redirect, setRedirect] = useState('');
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  let numberOfNights = 0;
  if (checkIn && checkOut) {
    numberOfNights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
  }

  async function bookThisPlace() {
    if (!name || !phone) {
      alert("Please fill out your name and phone number.");
      return;
    }

    try {
      const response = await axios.get('/bookings', {});
      // Asegúrate de que los IDs se comparen como strings
    const placeId = place._id.toString();

    // Filtrar las reservas por el placeId seleccionado
    const bookings = response.data.filter(booking => {
      // Convierte booking.place a string si es un ObjectId
      const bookingPlaceId = booking.place._id.toString();

      // Compara los IDs como strings
      return bookingPlaceId === placeId;
    });

      // Validar si la habitación está reservada entre las fechas seleccionadas
      const isRoomAvailable = bookings.every(booking => {

        const bookingCheckIn = new Date(booking.checkIn);
        const bookingCheckOut = new Date(booking.checkOut);
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);

        // La habitación está disponible si:
        // 1. La fecha de salida deseada es anterior o igual a la fecha de entrada de la reserva existente.
        // 2. La fecha de entrada deseada es posterior o igual a la fecha de salida de la reserva existente.
        return (checkOutDate <= bookingCheckIn || checkInDate >= bookingCheckOut);
      });

      if (isRoomAvailable) {
        const bookingResponse = await axios.post('/bookings', {
          checkIn, checkOut, numberOfGuests, name, phone,
          place: place._id,
          price: numberOfNights * place.price,
        });

        const bookingId = bookingResponse.data._id;
        setRedirect(`/account/bookings/${bookingId}`);
      } else {
        alert("The room isn't available in the selected dates");
      }
    } catch (error) {
      console.error('Error fetching or creating booking:', error);
      alert('An error occurred while processing your booking.');
    }
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
          <div className="py-3 px-4">
            <label>Check in:</label>
            <input type="date"
              value={checkIn}
              onChange={ev => setCheckIn(ev.target.value)} />
          </div>
          <div className="py-3 px-4 border-l">
            <label>Check out:</label>
            <input type="date" value={checkOut}
              onChange={ev => setCheckOut(ev.target.value)} />
          </div>
        </div>
        <div className="py-3 px-4 border-t">
          <label>Number of guests:</label>
          <input type="number"
            value={numberOfGuests}
            onChange={ev => setNumberOfGuests(ev.target.value)} />
        </div>
        {numberOfNights > 0 && (
          <div className="py-3 px-4 border-t">
            <label>Your full name:</label>
            <input type="text"
              value={name}
              onChange={ev => setName(ev.target.value)} />
            <label>Phone number:</label>
            <input type="tel"
              value={phone}
              onChange={ev => setPhone(ev.target.value)} />
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