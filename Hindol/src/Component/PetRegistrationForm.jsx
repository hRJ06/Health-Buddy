import React, { useState, useEffect } from 'react';

const PetRegistrationForm = () => {
  const [petInfo, setPetInfo] = useState({
    type: '',
    breed: '',
    disability: 'no',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPetInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  useEffect(() => {
    // Fetch dog breeds from The Dog API
    fetch('https://api.thedogapi.com/v1/breeds')
      .then((response) => response.json())
      .then((data) => {
        const dogBreeds = data.map((breed) => breed.name);
        setDogBreeds(dogBreeds);
      });

    // Fetch cat breeds from The Cat API
    fetch('https://api.thecatapi.com/v1/breeds')
      .then((response) => response.json())
      .then((data) => {
        const catBreeds = data.map((breed) => breed.name);
        setCatBreeds(catBreeds);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(petInfo);
  };

  const [dogBreeds, setDogBreeds] = useState([]);
  const [catBreeds, setCatBreeds] = useState([]);

  return (
    <div>
      <h2>Pet Registration Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="type">Pet Type:</label>
          <select
            name="type"
            id="type"
            value={petInfo.type}
            onChange={handleChange}
          >
            <option value="">Select a Type</option>
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
          </select>
        </div>
        {petInfo.type === 'dog' && (
          <div>
            <label htmlFor="breed">Breed:</label>
            <select
              name="breed"
              id="breed"
              value={petInfo.breed}
              onChange={handleChange}
            >
              <option value="">Select a Breed</option>
              {dogBreeds.map((breed) => (
                <option key={breed} value={breed}>
                  {breed}
                </option>
              ))}
            </select>
          </div>
        )}
        {petInfo.type === 'cat' && (
          <div>
            <label htmlFor="breed">Breed:</label>
            <select
              name="breed"
              id="breed"
              value={petInfo.breed}
              onChange={handleChange}
            >
              <option value="">Select a Breed</option>
              {catBreeds.map((breed) => (
                <option key={breed} value={breed}>
                  {breed}
                </option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label>Disability:</label>
          <label htmlFor="disability-yes">
            <input
              type="radio"
              name="disability"
              id="disability-yes"
              value="yes"
              checked={petInfo.disability === 'yes'}
              onChange={handleChange}
            />
            Yes
          </label>
          <label htmlFor="disability-no">
            <input
              type="radio"
              name="disability"
              id="disability-no"
              value="no"
              checked={petInfo.disability === 'no'}
              onChange={handleChange}
            />
            No
          </label>
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default PetRegistrationForm;
