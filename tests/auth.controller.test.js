// Import the necessary modules
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const request = require("supertest");
const sinon = require("sinon");
const passport = require("passport");
const mongoose = require("mongoose");


// Import express app or create a new one for test
const { initializeAuthStrategies } = require("../src/services/auth.service.ts");
const app = express();
app.use(cors());
app.use(bodyParser.json()); // Add body parser middleware
initializeAuthStrategies(); // Initialize passport strategies
// Initialize Passport and restore authentication state, if any, from the session.
app.use(passport.initialize());
const authRouter = require("../src/routes/auth.route.ts").default;
app.use("/auth", authRouter);


// Constants used for the test environment
const JWT_SECRET = "test_jwt_secret";
process.env.JWT_SECRET = JWT_SECRET;

// Mock the constants module
jest.mock("../src/utils/constants.ts", () => ({
  DATABASE_URL: "mongodb://0.0.0.0:27017",
  DATABASE_NAME: "real-time_chat",
  ACCESS_TOKEN_EXPIRES_IN: "1h",
  REFRESH_TOKEN_EXPIRES_IN: "1d",
  BCRYPT_SALT_ROUNDS: 10
}));

// This goes at the top level of your test file
afterAll(() => {
  mongoose.connection.close();
});

// A helper function to setup passport stubs before each test
function setupPassportStubs() {
  sinon.stub(passport, "authenticate").callsFake((strategy, options, callback) => {
    return (req, res) => {
      // You can modify the behavior here for different test scenarios
      const user = { name: "TestUser", email: "test@example.com", password: "password" };
      const info = null;
      const err = null;
      callback(err, user, info)(req, res);
    };
  });
}

// A helper function to tear down passport stubs after each test
function tearDownPassportStubs() {
  passport.authenticate.restore();
}

// Stub the jwt methods
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
  verify: jest.fn()
}));

const jwt = require("jsonwebtoken");

// Tests for /login
describe("/auth/login", () => {
  beforeEach(() => {
    setupPassportStubs();
    jwt.sign.mockImplementation(() => "mock_access_token");
    jwt.verify.mockImplementation(() => ({ user: { email: "test@example.com", name: "TestUser" } }));
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
