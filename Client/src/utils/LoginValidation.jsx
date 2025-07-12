// src/utils/LoginValidation.jsx

function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validateLogin({ email, password }) {
  const errors = {};

  if (!email) {
    errors.email = "Email is required";
  } else if (!validateEmail(email)) {
    errors.email = "Invalid email";
  }

  if (!password) {
    errors.password = "Password is required";
  }

  return errors;
}

// ✅ Export mặc định
export default validateLogin;
