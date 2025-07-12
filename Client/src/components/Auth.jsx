import { Link } from "react-router-dom";

const Auth = () => {
  return (
    <div className="flex items-center gap-3">
      <Link to="/login" className="auth-btn">
        Login
      </Link>
      <Link to="/register" className="auth-btn">
        Register
      </Link>
    </div>
  );
};

export default Auth;
