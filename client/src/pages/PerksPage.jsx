import { useContext, useState, useEffect } from "react";
import { UserContext } from "../UserContext.jsx";
import { Link, Navigate, useParams } from "react-router-dom";
import axios from "axios";
import PlacesPage from "./PlacesPage.jsx";
import AccountNav from "../AccountNav.jsx";

export default function PerksPage() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [icon, setIcon] = useState('');
    const [category, setCategory] = useState('');
    const [perk, setPerk] = useState('');
    const [redirect, setRedirect] = useState(false);

    async function savePerks(ev) {
        ev.preventDefault();
        const placeData = {
            name, description, icon, category
        };
        await axios.post('/perks', placeData);
        setRedirect(`/account/perks/`);
    }
    function parseSvg(svgString) {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
        const svgElement = svgDoc.querySelector('svg');
        return svgElement ? <span dangerouslySetInnerHTML={{ __html: svgElement.outerHTML }} /> : null;
    }
    useEffect(() => {
        axios.get('/perks').then(response => {
            setPerk(response.data);
        });
    }, []);
    if (redirect) {
        return <Navigate to={redirect} />;
      }
    return (
        <div>
            <AccountNav />
            <form className=" text-left max-w-md mx-auto" onSubmit={savePerks}>
                <h2 className="text-2xl mt-4">Name</h2>
                <input type="text"
                    required
                    placeholder="Wifi"
                    onChange={ev => setName(ev.target.value)} />
                <h2 className="text-2xl mt-4">Description</h2>
                <input type="text"
                    required
                    placeholder="Wifi de 10mb"
                    onChange={ev => setDescription(ev.target.value)} />
                <h2 className="text-2xl mt-4">Category</h2>
                <input type="text"
                    required
                    placeholder="Connectivity"
                    onChange={ev => setCategory(ev.target.value)} />
                <h2 className="text-2xl mt-4">Icon</h2>
                <input type="text"
                    required
                    placeholder="SVG Tag"
                    onChange={ev => setIcon(ev.target.value)} />
                <button className="primary my-4 w-full">Save</button>
            </form>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {perk.length > 0 ? (
                perk.map(perk => (
                    <label key={perk._id} className="border p-4 flex rounded-2xl gap-2 items-center bg-gray-50">
                        {parseSvg(perk.icon)}
                        <span>{perk.name.charAt(0).toUpperCase() + perk.name.slice(1)}</span>
                    </label>
                ))
            ) : (
                <p>Loading...</p>
            )}
        </div>

        </div>
    )
}