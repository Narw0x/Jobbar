import axios from "axios";

export function isValidText(value, minLength = 1) {
    return value && value.trim().length >= minLength;
  }

export function isValidEmail(value){
    return value && value.trim().includes('@');
}


export function isValidPassword(value){
    return value && value.trim().length >= 8;
}

export function isValidPhoneNumber(value){
    return value && value.trim().length >= 13 && value[0] === '+';
    
}

export const isValidAddress = async (inputValue) => {
    if (!inputValue.trim()) {
      console.log("Address field cannot be empty.");
      return;
    }

    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json`,
        {
          params: {
            address: inputValue,
            key: process.env.REACT_APP_GOOGLE_API_KEY,
          },
        }
      );

      const { data } = response;
      console.log(data);
      
      if (data.status === "OK" && data.results.length > 0) {
        console.log("Validated Address:", data.results[0]);
        return true;
      } else {
        console.log("Invalid address. Please enter a valid location.");
        return false;
      }
    } catch (err) {
        console.error("Error validating address:", err);
        return false;
    }
  };