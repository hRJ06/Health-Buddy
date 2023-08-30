import React, { useEffect, useState } from 'react';
import { Country, State, City } from 'country-state-city';

const Date = () => {
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    const [selectedIsoCode, setSelectedIsoCode] = useState(null);
    const [stateIsoCode, setStateIsoCode] = useState(null);

    useEffect(() => {
        setCountries(Country.getAllCountries());
    }, []);

    const handleCountryChange = (e) => {
        const selectedCountryIsoCode = e.target.value;
        setSelectedIsoCode(selectedCountryIsoCode);
        const selectedCountryStates = State.getStatesOfCountry(selectedCountryIsoCode);
        setStates(selectedCountryStates);
        setStateIsoCode(""); 
        setCities([]); 
    };

    const handleStateChange = (e) => {
        const selectedStateIsoCode = e.target.value;
        setStateIsoCode(selectedStateIsoCode);
        const selectedStateCities = City.getCitiesOfState(selectedIsoCode, selectedStateIsoCode);
        setCities(selectedStateCities);
    };

    return (
        <div>
            <select name="country" onChange={handleCountryChange} value={selectedIsoCode}>
                <option value="">Select a country</option>
                {countries.map((c) => (
                    <option key={c.isoCode} value={c.isoCode}>
                        {c.name}
                    </option>
                ))}
            </select>
            <p>Selected ISO Code: {selectedIsoCode}</p>
            {selectedIsoCode && (
                <div>
                    <select name="state" onChange={handleStateChange} value={stateIsoCode}>
                        <option value="">Select a State</option>
                        {states.map((s) => (
                            <option key={s.isoCode} value={s.isoCode}>
                                {s.name}
                            </option>
                        ))}
                    </select>
                    {stateIsoCode && (
                        <div>
                            <select name="city">
                                <option value="">Select a City</option>
                                {cities.map((city) => (
                                    <option key={city.name} value={city.name}>
                                        {city.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Date;
