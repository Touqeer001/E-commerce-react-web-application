const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[\d\s-]{7,15}$/;
const PINCODE_REGEX = /^\d{4,10}$/;

export const validateDeliveryAddress = (address = {}) => {
  const errors = {};

  const value = (key) => (address[key] || "").toString().trim();

  if (!value("first_name")) {
    errors.first_name = "First name is required.";
  } else if (value("first_name").length < 2) {
    errors.first_name = "First name must be at least 2 characters.";
  }

  if (!value("last_name")) {
    errors.last_name = "Last name is required.";
  }

  if (!value("email")) {
    errors.email = "Email is required.";
  } else if (!EMAIL_REGEX.test(value("email"))) {
    errors.email = "Please enter a valid email address.";
  }

  if (!value("phone")) {
    errors.phone = "Phone number is required.";
  } else if (!PHONE_REGEX.test(value("phone"))) {
    errors.phone = "Please enter a valid phone number.";
  }

  if (!value("city")) {
    errors.city = "City is required.";
  }

  if (!value("state")) {
    errors.state = "State / Province is required.";
  }

  if (!value("pincode")) {
    errors.pincode = "Postal code is required.";
  } else if (!PINCODE_REGEX.test(value("pincode"))) {
    errors.pincode = "Please enter a valid postal code.";
  }

  if (!value("country")) {
    errors.country = "Country is required.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default validateDeliveryAddress;
