import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, useParams } from "react-router-dom";
import { createHost, getHostById, updatehost } from "../../api/host.js";
import ComfirmationForm from "./ConfirmationForm.jsx";

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

const hourOptions = Array.from({ length: 24 }, (_, i) => ({
  value: `${i < 10 ? "0" : ""}${i}:00`, // Formato 'HH:00'
  label: `${i < 10 ? "0" : ""}${i}:00`, // Formato 'HH:00'
}));

export default function ConfirmationForm() {
  const { id } = useParams();

  // Centralize state inside a single object
  const [form, setForm] = useState({
    name: "",
    lastName: "",
    identification: "",
    nationality: "",
    address: "",
    phone: "",
    email: "",
    country: "",
    timeZone: "",
    arrivalTime: "",
  });

  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (!id) {
      return;
    }
    getHostById(id).then((response) => {
      const { data } = response;
      setForm({
        ...form,
        name: data.name,
        lastName: data.lastName,
        identification: data.identification,
        nationality: data.nationality,
        address: data.address,
        phone: data.phone,
        email: data.email,
        country: data.country,
        timeZone: data.timeZone,
        arrivalTime: "",
      });
    });
  }, [id]);

  const handleInputChange = (ev) => {
    const { name, value } = ev.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  async function saveHost(ev) {
    ev.preventDefault();
    const hostData = { ...form };
    console.log("hostData", hostData);

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

  return (
    <>
      <h1>Holder's Information</h1>
      <form onSubmit={saveHost}>
        {preInput("Name")}
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleInputChange}
        />
        {preInput("Lastname")}
        <input
          type="text"
          name="lastName"
          value={form.lastName}
          onChange={handleInputChange}
        />
        {preInput("Identification")}
        <input
          type="text"
          name="identification"
          value={form.identification}
          onChange={handleInputChange}
        />
        {preInput("Nationality", "Select your nationality")}
        <select
          name="nationality"
          value={form.nationality}
          onChange={handleInputChange}
          className="block w-full mt-2 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {renderOptions(countryOptions)}
        </select>
        {preInput("Address")}
        <input
          type="text"
          name="address"
          value={form.address}
          onChange={handleInputChange}
        />
        {preInput("Phone")}
        <input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleInputChange}
        />
        {preInput("Email")}
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleInputChange}
        />
        {preInput("Important Requests or Inquiries")}
        <textarea placeholder="Enter any important requests or inquiries here" />
        {preInput("If you wish, you can indicate an approximate arrival time:")}
        <select
          name="arrivalTime"
          value={form.arrivalTime}
          onChange={handleInputChange}
          className="block w-full mt-2 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select an arrival time</option>
          {renderOptions(hourOptions)}
        </select>
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg"
        >
          Save
        </button>
      </form>
    </>
  );
}
