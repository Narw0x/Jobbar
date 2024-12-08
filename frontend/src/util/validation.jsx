import axios from "axios";

export function isValidText(value, minLength = 1) {
    return value && value.trim().length >= minLength;
  }

  export function isValidEmail(value) {
    if (!value || typeof value !== 'string') return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value.trim());
}



export function isValidPassword(value) {
  if (!value || typeof value !== 'string') return false;
  // Minimum 8 characters, at least one uppercase letter, one lowercase letter, and one number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(value.trim());
}


export function isValidPhoneNumber(value) {
  if (!value || typeof value !== 'string') return false;
  // Regex to match the phone number in the format +XXX XXXXXXXXXX
  const phoneRegex = /^\+(\d{1,3})\s(\d{7,10})$/;
  return phoneRegex.test(value.trim());
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