import React, { useContext } from 'react';
import { GeneralContext } from '../context/GeneralContext';

const Register = ({ setIsLogin }) => {
  const { setUsername, setEmail, setPassword, usertype, setUsertype, register } = useContext(GeneralContext);

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log("Attempting register:", { usertype });
    await register();
  };

  return (
    <form className="authForm">
      <h2>Register</h2>

      <div className="form-floating mb-3 authFormInputs">
        <input type="text" className="form-control" placeholder="username"
          onChange={(e) => setUsername(e.target.value)} required />
        <label>Username</label>
      </div>

      <div className="form-floating mb-3 authFormInputs">
        <input type="email" className="form-control" placeholder="name@example.com"
          onChange={(e) => setEmail(e.target.value)} required />
        <label>Email address</label>
      </div>

      <div className="form-floating mb-3 authFormInputs">
        <input type="password" className="form-control" placeholder="Password"
          onChange={(e) => setPassword(e.target.value)} required />
        <label>Password</label>
      </div>

      <select className="form-select mb-3" onChange={(e) => setUsertype(e.target.value)} required>
        <option value="">Select user type</option>
        <option value="admin">Admin</option>
        <option value="customer">Customer</option>
        <option value="flight-operator">Flight Operator</option>
      </select>

      <button className="btn btn-primary" onClick={handleRegister}>Sign up</button>
      <p>Already registered? <span onClick={() => setIsLogin(true)}>Login</span></p>
    </form>
  );
};

export default Register;
