import { useState, useRef, useCallback, useEffect } from 'react';
import axios from 'axios';

const Autocomplete = ({ value = undefined, onChange = undefined }) => {
  const [suggestions, setSuggestions] = useState([]);
  const inputRef = useRef();
  const timeoutRef = useRef();

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


  const handleChange = useCallback(() => {
    const inputValue = inputRef.current?.value || '';
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Always trigger onChange immediately to update the controlled input
    if (onChange) {
      const fakeEvent = { target: { name: 'address', value: inputValue } };
      onChange(fakeEvent);
    }

    // Set a new timeout for the search functionality
    timeoutRef.current = setTimeout(() => {
      if (inputValue) {
        fetchPlaceSuggestions(inputValue);
      } else {
        setSuggestions([]);
      }
    }, 1000); // 1 second delay
  }, [onChange, fetchPlaceSuggestions, setSuggestions]);

  // Cleanup timeout on component unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Enter a location"
        name='address'
        className="bg-white text-custom_gray focus:bg-white focus:border-custom_gray border border-custom_gray rounded p-2 my-2 text-lg w-full"
      />
      <ul className="absolute z-50 mt-1 max-h-60 overflow-auto bg-white border rounded-md shadow-lg">
        {suggestions.map((suggestion) => (
          <li className='p-3 border-b ' key={suggestion.place_id}>
            <button 
              onClick={() => {
                if (onChange) {
                  const fakeEvent = { target: { name: 'address', value: suggestion.description } };
                  onChange(fakeEvent);
                }
                setSuggestions([]);
              }}
            >{suggestion.description}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Autocomplete;
