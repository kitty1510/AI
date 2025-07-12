import { useState } from "react";
import validateLogin from "../utils/LoginValidation";

import { registerUser } from "../apis/auth"; // Import the register function

function RegisterForm() {
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

    // Gọi hàm đăng ký người dùng
    registerUser({ email, password })
      .then((response) => {
        console.log("Đăng ký thành công:", response);
        // Xử lý đăng ký thành công, ví dụ: chuyển hướng đến trang đăng nhập
        window.location.href = "/login"; // Chuyển hướng đến trang đăng nhập
      })
      .catch((error) => {
        console.error("Lỗi đăng ký:", error);
        const message =
          error?.response?.data?.message ||
          "Đăng ký thất bại. Vui lòng thử lại.";

        setErrors({ server: message });
      });
    setErrors({});
  };

  return (
    <div className="flex justify-center h-auto pt-20 pb-50 ">
      <form
        onSubmit={handleSubmit}
        className="p-8 rounded-xl shadow-lg w-full max-w-md bg-gray-800"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-sky-100">
          Register
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
        {errors.server && (
          <p className="text-red-600 text-sm mt-2 text-center">
            {errors.server}
          </p>
        )}
      </form>
    </div>
  );
}

export default RegisterForm;
