import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../UserContext.jsx";

export default function BookingWidgetExternalEmbed({ place }) {
  place = {
    _id: "66c93762a51c37bf93bf6ee1",
    owner: "66bc249ab84837c992fc55f8",
    title: "Suite Presidencial",
    address: "Ocean Drive, Miami FL",
    photos: [
      "https://bookximages.s3.us-east-2.amazonaws.com/RoomImages/1724462919194.jpg",
      "https://bookximages.s3.us-east-2.amazonaws.com/RoomImages/1724463479142.jpg",
      "https://bookximages.s3.us-east-2.amazonaws.com/RoomImages/1724463521250.jpg",
    ],
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, s\n",
    perks: ["Parking", "Wifi", "TV", "Private entrance"],
    extraInfo:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, s\n",
    maxGuests: 2,
    price: 300,
    __v: 4,
  };
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [redirect, setRedirect] = useState("");
  const [occupiedDates, setOccupiedDates] = useState([]);
  const { user } = useContext(UserContext);
  const [showGuestInput, setShowGuestInput] = useState(false); // Nuevo estado

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  useEffect(() => {
    async function fetchOccupiedDates() {
      try {
        // Simula la respuesta del servidor
        let response = [
          { start: "2024-09-10T00:00:00Z", end: "2024-09-15T00:00:00Z" },
          { start: "2024-08-20T00:00:00Z", end: "2024-08-25T00:00:00Z" },
        ];
        setOccupiedDates(response);
      } catch (error) {
        console.error("Error fetching occupied dates:", error);
      }
    }
    fetchOccupiedDates();
  }, [place._id]);

  let numberOfNights = 0;
  if (checkIn && checkOut) {
    numberOfNights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  }

  async function bookThisPlace() {
    if (!name || !phone) {
      alert("Please fill out your name and phone number.");
      return;
    }

    try {
      const response = await axios.get("/bookings", {
        params: {
          place: place._id.toString(),
          checkIn: checkIn.toString(),
          checkOut: checkOut.toString(),
        },
      });

      const bookings = response.data;

      if (bookings.length === 0) {
        if (numberOfGuests <= place.maxGuests) {
          const bookingResponse = await axios.post("/bookings", {
            checkIn,
            checkOut,
            numberOfGuests,
            name,
            phone,
            place: place._id,
            price: numberOfNights * place.price,
            guests: numberOfGuests,
          });

          const bookingId = bookingResponse.data._id;
          setRedirect(`/account/bookings/${bookingId}`);
        } else {
          alert("The number of guests exceeds the maximum of the room");
        }
      } else {
        alert("The room isn't available in the selected dates");
      }
    } catch (error) {
      alert("An error occurred while processing your booking.");
    }
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  const isDateBlocked = (date) => {
    return occupiedDates.some(
      (occupiedDate) =>
        date >= new Date(occupiedDate.start) &&
        date <= new Date(occupiedDate.end)
    );
  };

  return (
    <div
      className="fixed flex justify-center bottom-0 left-0 w-full bg-white shadow-lg p-4"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.30)",
        backdropFilter: "blur(10px)",
        zIndex: 1000,
      }}
    >
      <div className="border rounded-2xl bg-gray-50 w-full max-w-4xl">
        <div className="flex">
          <div className="py-3 px-4 flex-1 min-w-[300px]">
            <label>Check in:</label>
            <DatePicker
              selected={checkIn}
              onChange={(dates) => {
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
              filterDate={(date) => !isDateBlocked(date)}
            />
          </div>
          <div className="py-3 px-4 flex-1 min-w-[300px]">
            <label>Check out:</label>
            <DatePicker
              selected={checkOut}
              onChange={(date) => setCheckOut(date)}
              startDate={checkIn}
              endDate={checkOut}
              minDate={checkIn || new Date()}
              selectsEnd
              className="form-input"
              placeholderText="Select check-out date"
              filterDate={(date) => !isDateBlocked(date)}
            />
          </div>
          <button onClick={bookThisPlace} className="primary m-6">
            Book Now
          </button>
        </div>
        {showGuestInput && (
          <div className="py-3 px-4 border-t">
            <label>Number of guests:</label>
            <input
              type="number"
              value={numberOfGuests}
              onChange={(ev) => setNumberOfGuests(ev.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
