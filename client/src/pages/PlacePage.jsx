import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import BookingWidget from "../BookingWidget";
import PlaceGallery from "../PlaceGallery";
import AddressLink from "../AddressLink";

export default function PlacePage() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [perks, setPerks] = useState('');
  function parseSvg(svgString) {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
    const svgElement = svgDoc.querySelector('svg');
    return svgElement ? <span dangerouslySetInnerHTML={{ __html: svgElement.outerHTML }} /> : null;
}
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get(`/places/${id}`).then(response => {
      setPlace(response.data);
    });
    axios.get('/perks').then(response => {
      setPerks(response.data);
      console.log(perks)
    });
  }, [id]);

  if (!place) return '';
  return (
    <div className="mt-4 bg-gray-100 -mx-8 px-8 pt-8">
      <h1 className="text-3xl">{place.title}</h1>
      <AddressLink>{place.address}</AddressLink>
      <PlaceGallery place={place} />
      <div className="mt-8 mb-8 grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr]">
        <div>
          <div className="my-4">
            <h2 className="font-semibold text-2xl">Description</h2>
            {place.description}
          </div>
          <div className="my-4">
            <h2 className="font-semibold text-2xl">Perks</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {place.perks.map(perkName => {
                const perk = perks.find(p => p.name.toLowerCase() === perkName.toLowerCase());
                return (
                  <label key={perkName} className="border p-4 flex rounded-2xl gap-2 items-center bg-gray-50">
                    {perk ? parseSvg(perk.icon) : <span>Icon not found</span>}
                    <span>{perkName.charAt(0).toUpperCase() + perkName.slice(1)}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
        <div>
          <BookingWidget place={place} />
          <div className="my-4">
            <h2 className="font-semibold text-2xl">Details</h2>
            Check-in: {place.checkIn}<br />
            Check-out: {place.checkOut}<br />
            Max number of guests: {place.maxGuests}
          </div>
        </div>
      </div>
      <div className="bg-white -mx-8 px-8 py-8 border-t">
        <div>
          <h2 className="font-semibold text-2xl">Extra info</h2>
        </div>
        <div className="mb-4 mt-2 text-sm text-gray-700 leading-5">{place.extraInfo}</div>
      </div>
    </div>
  );
}
