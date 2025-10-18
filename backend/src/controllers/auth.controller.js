import User from "../models/User.js";
import jwt from "jsonwebtoken";
import {
  createAccessToken,
  createRefreshToken,
} from "../utils/createTokens.js";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const emailExist = await User.findOne({ email });

    if (emailExist)
      return res
        .status(400)
        .json({ message: "Ya existe un usuario con ese email" });

    const newUser = new User({
      name,
      email,
      password,
    });

    await newUser.save();

    const accessToken = createAccessToken(newUser);
    const refreshToken = createRefreshToken(newUser);

    const hashedToken = await bcrypt.hash(refreshToken, 10);

    newUser.refreshToken = hashedToken;
    await newUser.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: "strict",
    });

    res.status(201).json({
      message: "Usuario creado correctamente",
      user: {
        name: newUser.name,
        email: newUser.email,
      },
      accessToken,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(401).json({ error: "El usuario no existe" });

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    const hashedToken = await bcrypt.hash(refreshToken, 10);

    await User.findByIdAndUpdate(user._id, { refreshToken: hashedToken });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false, // false en dev
      sameSite: "strict",
    });

    res.json({ accessToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const refresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken)
    return res.status(401).json({ error: "Falta refresh token" });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) return res.status(403).json({ error: "No autorizado" });

    const valid = await bcrypt.compare(refreshToken, user.refreshToken);

    if (!valid) return res.status(403).json({ error: "No autorizado" });

    const accessToken = createaccessToken(user);

    res.json({ accessToken });
  } catch (error) {
    return res.status(403).json({ error: "Refresh token inválido" });
  }
};

export const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) return res.sendStatus(204);

  await User.findOneAndUpdate({ refreshToken }, { refreshToken: null });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
    sameSite: "strict",
  });

  res.status(200).json({ message: "Sesión cerrada correctamente " });
};
