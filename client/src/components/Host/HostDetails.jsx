import AccountNav from "../../AccountNav.jsx";
import PhotosUploader from "../../PhotosUploader.jsx";
import Perks from "../../Perks.jsx";
import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, useParams } from "react-router-dom";
import { createHost, getHostById, updatehost } from "../../api/host.js";

const accommodationOptions = [
  { value: "hotel", label: "Hotel" },
  { value: "glamping", label: "Glamping" },
  { value: "hostel", label: "Hostel" },
  { value: "cabin", label: "Cabin" },
  { value: "apartment", label: "Apartment" },
  { value: "other", label: "Other" },
];

const currencyOptions = [
  { value: "COP", label: "Colombian Peso (COP)" },
  { value: "USD", label: "United States Dollar (USD)" },
  { value: "EUR", label: "Euro (EUR)" },
];

const countryOptions = [
  { value: "Col", label: "Colombia (CO)" },
  { value: "US", label: "United States (US)" },
  { value: "EUR", label: "Europe (EU)" },
];

const timeZones = [
  { value: "UTC", label: "UTC (Coordinated Universal Time)" },
  { value: "America/New_York", label: "America/New York (Eastern Time)" },
  { value: "America/Chicago", label: "America/Chicago (Central Time)" },
  { value: "America/Denver", label: "America/Denver (Mountain Time)" },
  { value: "America/Los_Angeles", label: "America/Los Angeles (Pacific Time)" },
  { value: "Europe/London", label: "Europe/London (GMT)" },
  { value: "Europe/Berlin", label: "Europe/Berlin (Central European Time)" },
  { value: "Asia/Tokyo", label: "Asia/Tokyo (Japan Standard Time)" },
  {
    value: "Australia/Sydney",
    label: "Australia/Sydney (Australian Eastern Standard Time)",
  },
  { value: "Asia/Kolkata", label: "Asia/Kolkata (Indian Standard Time)" },
];

export default function PlaceDetails() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [identification, setIdentification] = useState("");
  const [addedPhotos, setAddedLogos] = useState([]);
  const [placeType, setPlaceType] = useState("");
  const [currency, setCurrency] = useState("");
  const [country, setCountry] = useState("");
  const [migracionColombiaId, setMigracionColombiaId] = useState("");
  const [matriculaMercantil, setMatriculaMercantil] = useState("");
  const [rnt, setRnt] = useState("");
  const [timeZone, setTimeZone] = useState("");
  const [phone, setPhone] = useState(""); // Added state for phone
  const [email, setEmail] = useState(""); // Added state for email
  const [website, setWebsite] = useState("");
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (!id) {
      return;
    }
    getHostById(id).then((response) => {
      const { data } = response;
      setTitle(data.title);
      setIdentification(data.address);
      setAddedLogos(data.photos);
      setCurrency(data.description);
      setPerks(data.perks);
      setExtraInfo(data.extraInfo);
      setCheckIn(data.checkIn);
      setCheckOut(data.checkOut);
      setMaxGuests(data.maxGuests);
      setPrice(data.price);
      setCurrency(data.currency); // Set currency state from response
      setCountry(data.country); // Set country state from response
      setTimeZone(data.timeZone); // Set timeZone state from response
      setPhone(data.phone); // Set phone state from response
      setEmail(data.email); // Set email state from response
      setWebsite(data.website); // Set website state from response
    });
  }, [id]);

  function inputHeader(text) {
    return <h2 className="text-2xl mt-4">{text}</h2>;
  }

  function inputDescription(text) {
    return <p className="text-gray-500 text-sm">{text}</p>;
  }

  function preInput(header, description) {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  }

  async function saveHost(ev) {
    ev.preventDefault();
    const hostData = {
      title,
      address: identification,
      addedPhotos,
      description: currency,
      currency, // Include currency in placeData
      country, // Include country in placeData
      timeZone, // Include timeZone in placeData
      phone, // Include phone in placeData
      email, // Include email in placeData
      website, // Include website in placeData
    };
    console.log("hostData", hostData);

    //await axios.post("/places", hostData);
    await axios.post("/host", hostData);
    setRedirect(true);
  }

  if (redirect) {
    return <Navigate to={"/account/places"} />;
  }

  const renderOptions = (options) => {
    return [
      <option key="default" value="">
        Select an option
      </option>,
      ...options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      )),
    ];
  };
  //colores > insertar a la db

  return (
    <div>
      <AccountNav />
      <form onSubmit={saveHost}>
        {preInput("Accommodation Name", "The name of your lodging or brand.")}
        <input
          type="text"
          value={title}
          onChange={(ev) => setTitle(ev.target.value)}
          placeholder="Name"
        />
        {preInput("Identification")}
        <input
          type="text"
          value={identification}
          onChange={(ev) => setIdentification(ev.target.value)}
          placeholder="Identification"
        />
        {preInput("Logo", "The best way for your guests to recognize you.")}
        <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedLogos} />
        {preInput(
          "Accommodation Type",
          "Which of the following options best describes you?"
        )}
        <select
          value={placeType}
          onChange={(ev) => setPlaceType(ev.target.value)}
          className="block w-full mt-2 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {renderOptions(accommodationOptions)}
        </select>
        {preInput("Currency")}
        <select
          value={currency}
          onChange={(ev) => setCurrency(ev.target.value)}
          className="block w-full mt-2 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {renderOptions(currencyOptions)}
        </select>
        {preInput("Country")}
        <select
          value={country}
          onChange={(ev) => setCountry(ev.target.value)}
          className="block w-full mt-2 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {renderOptions(countryOptions)}
        </select>
        {preInput("Migration Colombia Code")}
        <input
          type="text"
          value={migracionColombiaId}
          onChange={(ev) => setMigracionColombiaId(ev.target.value)}
          placeholder="Migration Colombia ID"
        />
        {preInput("Commercial Registration")}
        <input
          type="text"
          value={matriculaMercantil}
          onChange={(ev) => setMatriculaMercantil(ev.target.value)}
          placeholder="Commercial Registration ID"
        />
        {preInput("RNT")}
        <input
          type="text"
          value={rnt}
          onChange={(ev) => setRnt(ev.target.value)}
          placeholder="RNT"
        />
        {preInput("Time Zone")}
        <select
          value={timeZone}
          onChange={(ev) => setTimeZone(ev.target.value)}
          className="block w-full mt-2 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {renderOptions(timeZones)}
        </select>
        {preInput("Phone")}
        <input
          type="text"
          value={phone}
          onChange={(ev) => setPhone(ev.target.value)}
          placeholder="Phone"
        />
        {preInput("Email")}
        <input
          type="text"
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
          placeholder="Email"
        />
        {preInput("Website")}
        <input
          type="text"
          value={website}
          onChange={(ev) => setWebsite(ev.target.value)}
          placeholder="Website"
        />
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg"
        >
          Save
        </button>
      </form>
    </div>
  );
}
