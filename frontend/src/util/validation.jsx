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

export function isValidAddress(value){
    return value && value.trim().length >= 5;
}