import React, { useState } from 'react';
import { stateOptions } from '../data/state';
import { doctorTypeOptions } from '../data/doctorType';
import toast from 'react-hot-toast';
import {AiFillEye, AiFillEyeInvisible} from 'react-icons/ai'

const Doctor = () => {
  const [user, setUser] = useState({
    firstName: null,
    lastName: null,
    email: null,
    password: null,
    phoneNo: null,
    role: 'doctor',
    type: null,
    licenseNo: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const validateFields= () => {
    for(const key in user) {
        if(user[key] === null || user[key] === '') {
          return key;
        }
      }
    return false;
  }
  const submitHandler = async(e) => {
    e.preventDefault();
    const isValid = validateFields();
    if(!isValid) {
        toast.success('Logged In')
    } 
    else {
        const fieldName = isValid
        .split(/(?=[A-Z])/)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
        toast.error(`${fieldName} is missing.`);
    }
  }
  const [seePassword, setSeePassword] = useState(false);
  return (
    <div>
      <form onSubmit={submitHandler}>
        <label htmlFor="firstName">First Name:</label>
        <input
          type="text"
          name="firstName"
          id="firstName"
          value={user.firstName || ''}
          onChange={handleChange}
        />

        <label htmlFor="lastName">Last Name:</label>
        <input
          type="text"
          name="lastName"
          id="lastName"
          value={user.lastName || ''}
          onChange={handleChange}
        />

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          name="email"
          id="email"
          value={user.email || ''}
          onChange={handleChange}
        />

       
        <label htmlFor="password">Password:</label>
        <input
          type={seePassword ? 'text' : 'password'}
          name="password"
          id="password"
          value={user.password || ''}
          onChange={handleChange}
        />

        <button type="button" onClick={() => setSeePassword(!seePassword)}>
          {seePassword ? <AiFillEyeInvisible/> : <AiFillEye/> }
        </button>

        <label htmlFor="phoneNo">Phone No:</label>
        <input
          type="text"
          name="phoneNo"
          id="phoneNo"
          value={user.phoneNo || ''}
          onChange={handleChange}
        />

        <select
          name="state"
          id="state"
          value={user.state || ''}
          onChange={handleChange}
        >
          <option value="">Select a State</option>
          {stateOptions.map((state) => (
            <option key={state.value} value={state.value}>
              {state.label}
            </option>
          ))}
        </select>

        <label htmlFor="type">Type:</label>
        <select
          name="type"
          id="type"
          value={user.type}
          onChange={handleChange}
        >
          <option value="">Select a Type</option>
          {doctorTypeOptions.map((typeOption) => (
            <option key={typeOption.value} value={typeOption.value}>
              {typeOption.label}
            </option>
          ))}
        </select>

        <label htmlFor="licenseNo">Phone No:</label>
        <input
          type=""
          name="licenseNo"
          id="licenseNo"
          value={user.licenseNo || ''}
          onChange={handleChange}
        />

        <button type='submit'>Register</button>
      </form>
    </div>
  );
};

export default Doctor;
