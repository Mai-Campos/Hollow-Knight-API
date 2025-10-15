import jwt from "jsonwebtoken";

export const createAccessToken = (user) => {
  return jwt.sign({ id: user._id, roles: user.role }, process.env.JWT_SECRET, {
    expiresIn: "3h",
  });
};

export const createRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};
