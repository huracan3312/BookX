import {useContext, useState, useEffect } from "react";
import {UserContext} from "../UserContext.jsx";
import {Link, Navigate, useParams} from "react-router-dom";
import axios from "axios";
import PlacesPage from "./PlacesPage";
import AccountNav from "../AccountNav";

export default function ProfilePage() {
  const [name,setName] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [lastName,setLastName] = useState('');
  const [phoneNumber,setPhoneNumber] = useState('');
  const [redirect,setRedirect] = useState(null);
  const {ready,user,setUser} = useContext(UserContext);
  let {subpage} = useParams();
  if (subpage === undefined) {
    subpage = 'profile';
  }

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setLastName(user.lastName || '');
      setPhoneNumber(user.phoneNumber || '');
      setEmail(user.email || '');
    }
  }, [user]);

  async function logout() {
    await axios.post('/logout');
    setRedirect('/');
    setUser(null);
  }

  if (!ready) {
    return 'Loading...';
  }

  if (ready && !user && !redirect) {
    return <Navigate to={'/login'} />
  }

  if (redirect) {
    return <Navigate to={redirect} />
  }

  async function updateUser(ev) {
    ev.preventDefault();
    try {
      await axios.put('/register', {
        name,
        lastName,
        phoneNumber,
        email,
        password,
      });
      alert('Update successful!!');
    } catch (e) {
      alert('Update failed. Please try again later');
    }
  }
  return (
    <div>
      <AccountNav />
      {subpage === 'profile' && (
        <div className="text-center max-w-lg mx-auto">
          Logged in as {user.name} ({user.email})<br />
          <button onClick={logout} className="primary max-w-sm mt-2">Logout</button>
          <form className=" text-left max-w-md mx-auto" onSubmit={updateUser}>
          <h2 className="text-2xl mt-4">Name</h2>
          <input type="text"
                 placeholder="John"
                 value={user.name}
                 onChange={ev => setName(ev.target.value)} />
          <h2 className="text-2xl mt-4">Last Name </h2>
          <input type="text"
                 placeholder="Doe"
                 value={user.lastName}
                 onChange={ev => setLastName(ev.target.value)} />
          <h2 className="text-2xl mt-4">Phone Number</h2>
          <input type="text"
                 placeholder="312000000"
                 value={user.phoneNumber}
                 onChange={ev => setPhoneNumber(ev.target.value)} />
          <h2 className="text-2xl mt-4">Email</h2>
          <input type="email"
                 placeholder="your@email.com"
                 value={user.email}
                 disabled
                 />
          <h2 className="text-2xl mt-4">Password</h2>
          <input type="password"
                 placeholder="password"
                 value={user.password}
                 onChange={ev => setPassword(ev.target.value)} />
          <button className="primary">Update</button>
        </form>
        </div>
      )}
      {subpage === 'places' && (
        <PlacesPage />
      )}
    </div>
  );
}