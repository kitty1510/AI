import { Link } from "react-router-dom";

const Auth = () => {
  const handleLogin = () => {
    // Logic for handling login can be added here
    window.location.href = "http://localhost/auth/google";
  };

  // if user is already logged in no need to show login and register buttons
  const accessToken = localStorage.getItem("access_token");
  if (accessToken) {
    return null; // or you can return a message like "You are already logged in"
  }

  return (
    <div className="flex items-center gap-3">
      <Link to="/login" className="auth-btn" onClick={handleLogin}>
        Login
      </Link>
      <Link to="/register" className="auth-btn">
        Register
      </Link>
    </div>
  );
};

export default Auth;
