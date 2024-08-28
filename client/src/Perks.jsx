import { useEffect, useState } from "react";
import axios from "axios";

export default function Perks({ selected, onChange }) {
  const [perks, setPerks] = useState([]);

  useEffect(() => {
    axios.get('/perks').then(response => {
      setPerks(response.data);
    });
  }, []);

  function parseSvg(svgString) {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
    const svgElement = svgDoc.querySelector('svg');
    return svgElement ? <span dangerouslySetInnerHTML={{ __html: svgElement.outerHTML }} /> : null;
  }

  function handleCbClick(ev) {
    const { checked, name } = ev.target;
    if (checked) {
      onChange([...selected, name]);
    } else {
      onChange([...selected.filter(selectedName => selectedName !== name)]);
    }
  }

  return (
    <>
      {perks.map((perk) => (
        <label key={perk._id} className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer">
          <input
            type="checkbox"
            checked={selected.includes(perk.name)}
            name={perk.name}
            onChange={handleCbClick}
          />
          {parseSvg(perk.icon)}
          <span>{perk.name.charAt(0).toUpperCase() + perk.name.slice(1)}</span>
        </label>
      ))}
    </>
  );
}
