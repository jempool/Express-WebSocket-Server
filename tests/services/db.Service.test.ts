import mongoose from "mongoose";
import { User } from "../../src/models/user";
import * as dbService from "../../src/services/db.service";

jest.mock("../../src/models/user", () => {
  return {
    User: jest.fn().mockImplementation(() => ({
      save: jest.fn().mockResolvedValue({}),
      toResponseObject: jest.fn(),
    })),
  };
});

jest.mock("../../src/services/db.service", () => {
  return {
    getUserByEmail: jest
      .fn()
      .mockImplementation((email) => User.findOne(email)),
    createUser: jest.fn().mockImplementation(() => User.prototype.save()),
  };
});

User.findOne = jest.fn();
User.prototype.save = jest.fn();

const userData = {
  username: "John",
  email: "john@example.com",
  password: "password123",
};

describe("DB Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getUserByEmail", () => {
    it("should retrieve user by email", async () => {
      const email = userData.email;
      const fakeUser = { id: new mongoose.Types.ObjectId(), ...userData };
      User.findOne = jest.fn().mockResolvedValue(fakeUser);
      const user = await dbService.getUserByEmail(email);

      expect(User.findOne).toHaveBeenCalledWith(email);
      expect(user).toEqual(fakeUser);
    });
  });

  describe("createUser", () => {
    it("should create a new user", async () => {
      const fakeUser = { id: new mongoose.Types.ObjectId(), ...userData };
      User.prototype.save.mockResolvedValue(fakeUser);
      const newUser = await dbService.createUser(userData);

      expect(User.prototype.save).toHaveBeenCalled();
      expect(newUser).toEqual(fakeUser);
    });
  });
});
