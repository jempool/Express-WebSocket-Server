// Import the necessary modules
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import request from "supertest";
import sinon from "sinon";
import passport from "passport";
import mongoose from "mongoose";

// Import express app or create a new one for test
import { initializeAuthStrategies } from "../../src/services/auth.service.ts";
import authRouter from "../../src/routes/auth.route.ts";

const app = express();
app.use(cors());
app.use(bodyParser.json()); // Add body parser middleware
initializeAuthStrategies(); // Initialize passport strategies
// Initialize Passport and restore authentication state, if any, from the session.
app.use(passport.initialize());
app.use("/auth", authRouter);

// Constants used for the test environment
const JWT_SECRET = "test_jwt_secret";
process.env.JWT_SECRET = JWT_SECRET;

// Mock the constants module
jest.mock("../../src/utils/constants.ts", () => ({
  DATABASE_URL: "mongodb://0.0.0.0:27017",
  DATABASE_NAME: "real-time_chat",
  ACCESS_TOKEN_EXPIRES_IN: "1h",
  REFRESH_TOKEN_EXPIRES_IN: "1d",
  BCRYPT_SALT_ROUNDS: 10,
}));

// This goes at the top level of your test file
afterAll(() => {
  mongoose.connection.close();
});

// A helper function to setup passport stubs before each test
function setupPassportStubs() {
  sinon
    .stub(passport, "authenticate")
    .callsFake((strategy, options, callback) => {
      return (req, res) => {
        // You can modify the behavior here for different test scenarios
        const user = {
          name: "TestUser",
          email: "test@example.com",
          password: "password",
        };
        const info = null;
        const err = null;
        if (callback) {
          callback(err, user, info || {})(req, res);
        }
      };
    });
}

// A helper function to tear down passport stubs after each test
function tearDownPassportStubs() {
  sinon.restore();
}

// Stub the jwt methods
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

import jwt from "jsonwebtoken";

// Tests for /login
describe("/auth/login", () => {
  beforeEach(() => {
    setupPassportStubs();
    jest.spyOn(jwt, "sign").mockImplementation(() => "mock_access_token");
    jest.spyOn(jwt, "verify").mockImplementation(() => ({
      user: { email: "test@example.com", name: "TestUser" },
    }));
  });

  afterEach(() => {
    tearDownPassportStubs();
    jest.clearAllMocks();
  });

  it("should authenticate and return tokens if credentials are correct", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({ email: "test@example.com", password: "password" });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("accessToken");
    expect(response.body).toHaveProperty("refreshToken");
  });
});
