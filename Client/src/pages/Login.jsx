import { useState } from "react";
import validateLogin from "../utils/LoginValidation";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [submitAnimation, setSubmitAnimation] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateLogin({ email, password });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    console.log("Đăng nhập thành công:", { email, password });

    // reset animation sau khi xử lý
    // Xử lý tiếp theo...

    // xử lý tiếp theo...
  };

  return (
    <div className="flex justify-center h-auto pt-20">
      <form
        onSubmit={handleSubmit}
        className="p-8 rounded-xl shadow-lg w-full max-w-md bg-gray-800"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-sky-100">
          Login
        </h2>

        <div className="mb-4">
          <label className="block text-sky-100 mb-1">Email</label>
          <input
            className={`w-full px-4 py-2 rounded-md border text-sky-100 ${
              errors.email ? "border-red-500" : "border-slate-300"
            } focus:outline-none focus:ring-2 ${
              errors.email ? "focus:ring-red-500" : "focus:ring-sky-500"
            }`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sky-100 mb-1">Password</label>
          <input
            type="password"
            className={`w-full px-4 py-2 rounded-md border text-sky-100 ${
              errors.password ? "border-red-500" : "border-slate-300"
            } focus:outline-none focus:ring-2 ${
              errors.password ? "focus:ring-red-500" : "focus:ring-sky-500"
            }`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="text-red-600 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          className={`w-full bg-none rounded-xl border-b pt-5 ${
            Object.keys(errors).length > 0 ? "border-red-500" : "border-sky-300"
          }  transition text-sky-100 `}
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
