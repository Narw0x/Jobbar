import { useEffect, useRef } from "react";

const Autocomplete = ({userAddress = undefined, handleChange = undefined}) => {
  const inputRef = useRef(null); // Ref for the input element
  const autocompleteRef = useRef(null); // Ref to store the autocomplete object

  useEffect(() => {
    if (!window.google) {
      console.error("Google Maps API not loaded.");
      return;
    }

    const autocompleteOptions = {
      fields: ["place_id", "geometry", "name"], // Limit fields for optimization
      types: ["address"], // Restrict results to addresses
    };

    autocompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      autocompleteOptions
    );

    autocompleteRef.current.addListener("place_changed", handlePlaceSelect);
  }, []);

  // Handle place selection
  const handlePlaceSelect = () => {
    const place = autocompleteRef.current.getPlace();
    if (place) {
      console.log("Selected Place:", place);
    }
  };

  return (
      <input
        ref={inputRef}
        type="text"
        placeholder="Enter a location"
        className="bg-white focus:bg-white border border-custom_gray focus:border-custom_gray rounded p-2 my-2 text-lg w-full"
        name="address"
        value={userAddress}
        onChange={handleChange}
        id="address"
      />
  );
};

export default Autocomplete;
