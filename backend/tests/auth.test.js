import request from "supertest";
import User from "../src/models/User.js";
import app from "../src/app.js";
import { clearDatabase, connect, closeDatabase } from "./setup.js";

beforeAll(async () => {
  process.env.JWT_SECRET = "testsecret";
  process.env.JWT_REFRESH_SECRET = "refreshsecret";
  await connect();
});
afterEach(async () => await clearDatabase());
afterAll(async () => await closeDatabase());

describe("Auth API", () => {
  const userData = {
    name: "Miguel",
    email: "migue@test.com",
    password: "123456",
  };

  test("should register a new user", async () => {
    const res = await request(app).post("/api/auth/register").send(userData);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("accesToken");
    expect(res.body.user.email).toBe(userData.email);

    const user = await User.findOne({ email: userData.email });
    expect(user).not.toBeNull();
  });

  test("should login an existing user", async () => {
    await request(app).post("/api/auth/register").send(userData);

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: userData.email, password: userData.password });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("accesToken");
  });

  test("should not login with wrong password", async () => {
    await request(app).post("/api/auth/register").send(userData);

    const res = await request(app).post("/api/auth/login").send({
      email: userData.email,
      password: "wrongPassword",
    });
    expect(res.statusCode).toBe(401);
  });

  test("should logout user", async () => {
    await request(app).post("/api/auth/register").send(userData);
    const loginRes = await request(app).post("/api/auth/login").send(userData);

    const cookie = loginRes.headers["set-cookie"];

    const res = await request(app)
      .post("/api/auth/logout")
      .set("Cookie", cookie);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Sesión cerrada correctamente ");
  });
});
