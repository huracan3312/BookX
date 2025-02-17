import {Link} from "react-router-dom";
import {useState} from "react";
import axios from "axios";

export default function RegisterPage() {
  const [name,setName] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [lastName,setLastName] = useState('');
  const [phoneNumber,setPhoneNumber] = useState('');
  async function registerUser(ev) {
    ev.preventDefault();
    try {
      await axios.post('/register', {
        name,
        lastName,
        phoneNumber,
        email,
        password,
      });
      alert('Registration successful. Now you can log in');
    } catch (e) {
      alert('Registration failed. Please try again later');
    }
  }
  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64">
        <h1 className="text-4xl text-center mb-4">Register</h1>
        <form className="max-w-md mx-auto" onSubmit={registerUser}>
          <h2 className="text-2xl mt-4">Name</h2>
          <input type="text"
                 placeholder="John"
                 value={name}
                 onChange={ev => setName(ev.target.value)} />
          <h2 className="text-2xl mt-4">Last Name </h2>
          <input type="text"
                 placeholder="Doe"
                 value={lastName}
                 onChange={ev => setLastName(ev.target.value)} />
          <h2 className="text-2xl mt-4">Phone Number</h2>
          <input type="text"
                 placeholder="312000000"
                 value={phoneNumber}
                 onChange={ev => setPhoneNumber(ev.target.value)} />
          <h2 className="text-2xl mt-4">Email</h2>
          <input type="email"
                 placeholder="your@email.com"
                 value={email}
                 onChange={ev => setEmail(ev.target.value)} />
          <h2 className="text-2xl mt-4">Password</h2>
          <input type="password"
                 placeholder="password"
                 value={password}
                 onChange={ev => setPassword(ev.target.value)} />
          <button className="primary">Register</button>
          <div className="text-center py-2 text-gray-500">
            Already a member? <Link className="underline text-black" to={'/login'}>Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}