// React example using Axios for Google Places Autocomplete API
import { useState, useRef } from 'react';
import axios from 'axios';

const Autocomplete = ({ value = undefined, onChange = undefined }) => {
  const [suggestions, setSuggestions] = useState([]);
  const inputRef = useRef();

  const fetchPlaceSuggestions = async (inputValue) => {
    try {
      axios.get('http://localhost:4000/api/autocomplete', {
        params: {
          search: inputValue,
        },
      }).then((response) => {
        if (response.status === 200) {
          setSuggestions(response.data.payload.suggestions );
        }
      })} catch (error) {
        console.error('Error fetching place suggestions:', error);
      }
  }


  const handleChange = () => {
    const inputValue = inputRef.current?.value || '';
    if (onChange) {
        const fakeEvent = { target: { name: 'autocomplete', value: inputValue } }; // Simulate `e.target`
        onChange(fakeEvent); // Ensure consistency
    }

    if (inputValue) {
        fetchPlaceSuggestions(inputValue);
    } else {
        setSuggestions([]);
    }
};


  return (
    <div>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Enter a location"
        name='address'
      />
      <ul>
        {suggestions.map((suggestion) => (
          <li key={suggestion.place_id}>{suggestion.description}</li>
        ))}
      </ul>
    </div>
  );
};

export default Autocomplete;
