import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import AddressLink from "../AddressLink";
import PlaceGallery from "../PlaceGallery";
import BookingDates from "../components/Booking/BookingDates";
import { Navigate } from "react-router-dom";

export default function BookingPage() {
  const [redirect, setRedirect] = useState('');
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [modal, setModal] = useState(false);

  const [updatedBooking, setUpdatedBooking] = useState({
    guests: '',
    name: '',
    phone: ''
  });

  useEffect(() => {
    if (id) {
      axios.get("/bookings").then((response) => {
        const foundBooking = response.data.find(({ _id }) => _id === id);
        if (foundBooking) {
          setBooking(foundBooking);
          setUpdatedBooking({
            guests: foundBooking.guests || '',
            name: foundBooking.name || '',
            phone: foundBooking.phone || ''
          });
        }
      });
    }
  }, [id]);

  if (!booking) {
    return '';
  }

  async function cancelBooking(ev) {
    ev.preventDefault();
    const isConfirmed = window.confirm('Are you sure you want to cancel this booking?');
    if (isConfirmed) {
      try {
        await axios.delete(`/bookings/${id}`);
        alert('Booking canceled!');
        setRedirect(`/account/bookings/`);
      } catch (e) {
        alert('Cancellation failed. Please try again later');
      }
    }
  }

  
  function openModal() {
    setModal((prev) => !prev);
  }
  
  async function modifyBooking() {
    try {
      const response = await axios.put(`/bookings/${id}`, updatedBooking);
      setBooking(response.data.booking); // Actualizar la UI con los nuevos datos
      alert("Booking updated successfully!");
      setModal(false);
      window.location.reload();
    } catch (error) {
      alert("Error updating booking. Please try again.");
    }
  }
  
  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div className="my-8">
      <h1 className="text-3xl">{booking.place.title}</h1>
      <AddressLink className="my-2 block">{booking.place.address}</AddressLink>
      <div className="bg-gray-200 p-6 my-6 rounded-2xl flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-4">Your booking information:</h2>
          <BookingDates booking={booking} />
        </div>
        <div className="bg-primary p-6 text-white rounded-2xl">
          <div>Total price</div>
          <div className="text-3xl">${booking.price}</div>
        </div>
      </div>
      <PlaceGallery place={booking.place} />
      <div className="flex gap-4">
        <button className="secondary my-4 flex-1" onClick={cancelBooking}>
          Cancel Booking
        </button>
        <button className="primary my-4 flex-1" onClick={openModal}>
          Modify Booking
        </button>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl mb-4">Modify Booking</h2>
            <div className="py-3 px-4 border-t">
              <label>Number of guests:</label>
              <input
                type="number"
                value={updatedBooking.guests}
                onChange={(ev) => setUpdatedBooking({ ...updatedBooking, guests: ev.target.value })}
                className="border p-2 w-full rounded"
              />
              <label>Your full name:</label>
              <input
                type="text"
                value={updatedBooking.name}
                onChange={ev => setUpdatedBooking({ ...updatedBooking, name: ev.target.value })}
                className="border p-2 w-full rounded"
              />
              <label>Phone number:</label>
              <input
                type="tel"
                value={updatedBooking.phone}
                onChange={ev => setUpdatedBooking({ ...updatedBooking, phone: ev.target.value })}
                className="border p-2 w-full rounded"
              />
            </div>
            <div className="flex justify-end gap-4 mt-4">
              <button className="secondary px-4 py-2 rounded" onClick={openModal}>
                Close
              </button>
              <button className="primary px-4 py-2 rounded" onClick={modifyBooking}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
