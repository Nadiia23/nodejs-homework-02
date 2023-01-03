/* eslint-disable no-undef */
const mongoose = require("mongoose");
const request = require("supertest");
require("dotenv").config();

const app = require("../app");
const createHashPassword = require("../helpers/createHashPassword");
const User = require("../models/user");

mongoose.set("strictQuery", false);

const { MONGO_URI, PORT } = process.env;

describe("test users routes", () => {
  let server;
  beforeAll(() => (server = app.listen(PORT)));
  afterAll(() => server.close());
  beforeEach((done) => {
    mongoose.connect(MONGO_URI).then(() => done());
  });

  afterEach((done) => {
    mongoose.connection.close();
    done();
  });

  test("test login route", async () => {
    const newUser = {
      email: "nadiatest@gmail.com",
      avatarURL: "mockurl",
      password: "12345test",
    };
    const hashPassword = await createHashPassword(newUser.password);
    const user = await User.create({ ...newUser, password: hashPassword });
    const loginUser = {
      email: "nadiatest@gmail.com",
      password: "12345test",
    };
    const response = await request(app)
      .post("/api/users/login")
      .send(loginUser);
    expect(response.statusCode).toBe(200);
    const { body } = response;
    expect(body.token).toBeTruthy();
    const { token, email, subscription } = await User.findById(user._id);
    expect(body.token).toBe(token);
    expect(typeof email === "string" && typeof subscription === "string").toBe(
      true
    );
    await User.findByIdAndDelete(user._id);
  });
});