import request from "supertest";
import app from "../src/app.js";
import Ability from "../src/models/Ability";
import User from "../src/models/User";
import { connect, closeDatabase, clearDatabase } from "./setup";

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

const abilityData = {
  name: "nail stroke",
  description: "A basic attack with the nail",
};

describe("Abilities API", () => {
  test("should allow authenticated user to GET abilities", async () => {
    const { token } = await createUserAndLogin();
    await Ability.create(abilityData);

    const res = await request(app)
      .get("/api/abilities")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("should not allow unauthenticated user to GET abilities", async () => {
    await Ability.create(abilityData);

    const res = await request(app).get("/api/abilities");

    expect(res.statusCode).toBe(401);
  });

  test("should allow authenticated user to GET an ability by ID", async () => {
    const { token } = await createUserAndLogin();
    const ability = await Ability.create(abilityData);

    const res = await request(app)
      .get(`/api/abilities/${ability._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("nail stroke");
  });

  test("should not allow unauthenticated user to GET an ability by ID", async () => {
    const ability = await Ability.create(abilityData);

    const res = await request(app).get(`/api/abilities/${ability._id}`);

    expect(res.statusCode).toBe(401);
  });

  test("should allow admin to create an ability", async () => {
    const { token } = await createUserAndLogin(["admin"]);

    const res = await request(app)
      .post(`/api/abilities`)
      .set("Authorization", `Bearer ${token}`)
      .send(abilityData);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.name).toBe("nail stroke");
  });

  test("should not allow user to create an ability", async () => {
    const { token } = await createUserAndLogin();

    const res = await request(app)
      .post(`/api/abilities`)
      .set("Authorization", `Bearer ${token}`)
      .send(abilityData);

    expect(res.statusCode).toBe(403);
  });

  test("should allow admin to update an ability", async () => {
    const { token } = await createUserAndLogin(["admin"]);
    const ability = await Ability.create(abilityData);

    const res = await request(app)
      .put(`/api/abilities/${ability._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ description: "Basic nail strike to damage enemies." });

    expect(res.statusCode).toBe(200);
    expect(res.body.description).toBe("Basic nail strike to damage enemies.");
  });

  test("should not allow user to update an ability", async () => {
    const { token } = await createUserAndLogin();
    const ability = await Ability.create(abilityData);

    const res = await request(app)
      .put(`/api/abilities/${ability._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ description: "Basic nail strike to damage enemies." });

    expect(res.statusCode).toBe(403);
  });

  test("should allow admin to delete an ability", async () => {
    const { token } = await createUserAndLogin(["admin"]);
    const ability = await Ability.create(abilityData);

    const res = await request(app)
      .delete(`/api/abilities/${ability._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(204);
    const exist = await Ability.findById(ability._id);
    expect(exist).toBeNull();
  });

  test("should allow admin to delete an ability", async () => {
    const { token } = await createUserAndLogin();
    const ability = await Ability.create(abilityData);

    const res = await request(app)
      .delete(`/api/abilities/${ability._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(403);
    const exist = await Ability.findById(ability._id);
    expect(exist).not.toBeNull();
  });
});
