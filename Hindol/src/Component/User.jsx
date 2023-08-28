import React, { useState } from 'react';
import toast from 'react-hot-toast';
import {AiFillEye, AiFillEyeInvisible} from 'react-icons/ai'

const UserSignup = () => {
  const [user, setUser] = useState({
    firstName: null,
    lastName: null,
    email: null,
    password: null,
    phoneNo: null,
    role: 'user',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const [seePassword, setSeePassword] = useState(false);
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
        <button type='submit'>Register</button>
      </form>
    </div>
  );
};

export default UserSignup;
