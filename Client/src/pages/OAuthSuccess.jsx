import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function OAuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("access_token");
    const userId = params.get("userId");

    if (accessToken && userId) {
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("user_id", userId); // lưu userId

      navigate("/"); // redirect về trang chính hoặc dashboard
    }
  }, []);

  return <div>Đang đăng nhập...</div>;
}

export default OAuthSuccess;
