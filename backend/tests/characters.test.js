import request from "supertest";
import app from "../src/app.js";
import Character from "../src/models/Character.js";
import { connect, clearDatabase, closeDatabase } from "./setup.js";
import User from "../src/models/User.js";

beforeAll(async () => {
  process.env.JWT_SECRET = "testsecret";
  process.env.JWT_REFRESH_SECRET = "refreshsecret";
  await connect();
});

afterEach(async () => await clearDatabase());
afterAll(async () => closeDatabase());

const createUserAndLogin = async (role = ["user"]) => {
  const userData = {
    name: "Test User",
    email: "test@email.com",
    password: "test.password",
    role,
  };

  const user = new User(userData);
  await user.save();

  const loginRes = await request(app)
    .post("/api/auth/login")
    .send({ email: userData.email, password: userData.password });

  if (!loginRes.body.accesToken)
    throw new Error("Login falló en createUserAndLogin");

  return { userData, token: loginRes.body.accesToken };
};

const characterData = {
  name: "HOLLOW KNIGHT",
  description: "The hollow knight",
};

describe("Characters API", () => {
  test("should allow authenticated user to GET characters", async () => {
    const { token } = await createUserAndLogin();
    await Character.create(characterData);

    const res = await request(app)
      .get("/api/characters")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("should not allow unauthenticated user to GET characters", async () => {
    const res = await request(app).get("/api/characters");
    expect(res.statusCode).toBe(401);
  });

  test("should allow authenticated user to GET character by ID", async () => {
    const { token } = await createUserAndLogin();
    const char = await Character.create(characterData);

    const res = await request(app)
      .get(`/api/characters/${char._id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("HOLLOW KNIGHT");
  });

  test("should not allow unauthenticated user to GET character by ID", async () => {
    const char = await Character.create(characterData);

    const res = await request(app).get(`/api/characters/${char._id}`);
    expect(res.statusCode).toBe(401);
  });

  test("should allow admin to create a character", async () => {
    const { token } = await createUserAndLogin(["admin"]);

    const res = await request(app)
      .post("/api/characters")
      .set("Authorization", `Bearer ${token}`)
      .send(characterData);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.name).toBe("HOLLOW KNIGHT");
  });

  test("should not allow user to create a character", async () => {
    const { token } = await createUserAndLogin();

    const res = await request(app)
      .post("/api/characters")
      .set("Authorization", `Bearer ${token}`)
      .send(characterData);
    expect(res.statusCode).toBe(403);
  });

  test("should allow admin to update a character", async () => {
    const { token } = await createUserAndLogin(["admin"]);
    const char = await Character.create(characterData);

    const res = await request(app)
      .put(`/api/characters/${char._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ description: "The hollow Knight updated" });
    expect(res.statusCode).toBe(200);
    expect(res.body.description).toBe("The hollow Knight updated");
  });

  test("should not allow user to update a character", async () => {
    const { token } = await createUserAndLogin();
    const char = await Character.create(characterData);

    const res = await request(app)
      .put(`/api/characters/${char._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ description: "The hollow Knight updated" });
    expect(res.statusCode).toBe(403);

    const character = await Character.findById(char._id);
    expect(character.description).toBe("The hollow knight");
  });

  test("should allow admin to delete a character", async () => {
    const { token } = await createUserAndLogin(["admin"]);
    const char = await Character.create(characterData);

    const res = await request(app)
      .delete(`/api/characters/${char._id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(204);
    const exist = await Character.findById(char._id);
    expect(exist).toBeNull();
  });

  test("should not allow user to delete a character", async () => {
    const { token } = await createUserAndLogin();
    const char = await Character.create(characterData);

    const res = await request(app)
      .delete(`/api/characters/${char._id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(403);
    const exist = await Character.findById(char._id);
    expect(exist).not.toBeNull();
  });
});
