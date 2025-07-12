import express from "express";
import { oauth2Client, scopes } from "../config/googleOAuth.js";
import User from "../models/User.js"; // Import model nếu cần lưu thông tin người dùng
import { google } from "googleapis"; // Import Google APIs client library

const authRoute = express.Router();

authRoute.get("/", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
  });
  res.redirect(url);
});

authRoute.get("/callback", async (req, res) => {
  const { code } = req.query;
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  const oauth2 = google.oauth2({
    auth: oauth2Client,
    version: "v2",
  });

  // Lấy thông tin người dùng từ Google
  const userInfo = await oauth2.userinfo.get();
  console.log("User Info:", userInfo.data);
  const { email, name, picture } = userInfo.data;
  // Kiểm tra xem người dùng đã tồn tại trong cơ sở dữ liệu chưa
  let user = await User.findOne({ email });
  if (!user) {
    // Nếu người dùng chưa tồn tại, tạo mới
    user = new User({
      email,
      name,
      avatar: picture,
      googleId: userInfo.data.id, // Lưu ID Google để xác định người dùng
    });
    await user.save();
  }
  // cập nhât thông tin người dùng
  user.name = name;
  user.avatar = picture;
  user.googleId = userInfo.data.id; // Cập nhật ID Google nếu cần
  await user.save();

  // Gửi access_token lên frontend qua query (có thể dùng localStorage ở client để lưu)
  const redirectUrl = `http://localhost:5173/oauth-success?access_token=${tokens.access_token}&userId=${user._id}`;
  res.redirect(redirectUrl);
});
export default authRoute;
