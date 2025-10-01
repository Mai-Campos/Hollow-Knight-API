import request from "supertest";
import app from "../src/app.js";
import Region from "../src/models/Region.js";
import User from "../src/models/User.js";
import { connect, closeDatabase, clearDatabase } from "./setup.js";

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

const regionData = {
  name: "city of tears",
  description: "A city full of wandering guardians",
};

describe("Regions API", () => {
  test("should allow authenticated user to GET regions", async () => {
    const { token } = await createUserAndLogin();
    await Region.create(regionData);

    const res = await request(app)
      .get("/api/regions")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("should not allow unauthenticated user to GET regions", async () => {
    await Region.create(regionData);

    const res = await request(app).get("/api/regions");

    expect(res.statusCode).toBe(401);
  });

  test("should allow authenticated user to GET an Region by ID", async () => {
    const { token } = await createUserAndLogin();
    const region = await Region.create(regionData);

    const res = await request(app)
      .get(`/api/regions/${region._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("city of tears");
  });

  test("should not allow unauthenticated user to GET an Region by ID", async () => {
    const region = await Region.create(regionData);

    const res = await request(app).get(`/api/regions/${region._id}`);

    expect(res.statusCode).toBe(401);
  });

  test("should allow admin to create an Region", async () => {
    const { token } = await createUserAndLogin(["admin"]);

    const res = await request(app)
      .post(`/api/regions`)
      .set("Authorization", `Bearer ${token}`)
      .send(regionData);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.name).toBe("city of tears");
  });

  test("should not allow user to create an Region", async () => {
    const { token } = await createUserAndLogin();

    const res = await request(app)
      .post(`/api/regions`)
      .set("Authorization", `Bearer ${token}`)
      .send(regionData);

    expect(res.statusCode).toBe(403);
  });

  test("should allow admin to update an Region", async () => {
    const { token } = await createUserAndLogin(["admin"]);
    const region = await Region.create(regionData);

    const res = await request(app)
      .put(`/api/regions/${region._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ description: "A city full of wandering guardians and bugs." });

    expect(res.statusCode).toBe(200);
    expect(res.body.description).toBe(
      "A city full of wandering guardians and bugs."
    );
  });

  test("should not allow user to update an Region", async () => {
    const { token } = await createUserAndLogin();
    const region = await Region.create(regionData);

    const res = await request(app)
      .put(`/api/regions/${Region._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ description: "A city full of wandering guardians and bugs." });

    expect(res.statusCode).toBe(403);
  });

  test("should allow admin to delete an Region", async () => {
    const { token } = await createUserAndLogin(["admin"]);
    const region = await Region.create(regionData);

    const res = await request(app)
      .delete(`/api/regions/${region._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(204);
    const exist = await Region.findById(region._id);
    expect(exist).toBeNull();
  });

  test("should allow admin to delete an Region", async () => {
    const { token } = await createUserAndLogin();
    const region = await Region.create(regionData);

    const res = await request(app)
      .delete(`/api/regions/${region._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(403);
    const exist = await Region.findById(region._id);
    expect(exist).not.toBeNull();
  });
});
