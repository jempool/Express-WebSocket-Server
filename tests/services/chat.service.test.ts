jest.mock("../../src/services/db.service", () => ({
  getAllHistory: jest.fn(),
}));

import * as dbService from "../../src/services/db.service";
import { getAllHistory } from "../../src/services/chat.service";

describe("getAllHistory function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return the result of getAllHistory", async () => {
    const mockMessage = [
      {
        message: "Hi",
        handle: "testUser",
      },
      {
        message: "Hello!",
        handle: "testUser",
      },
    ];
    (dbService.getAllHistory as jest.Mock).mockResolvedValue(mockMessage);

    const result = await getAllHistory();

    expect(result).toEqual(mockMessage);
    expect(dbService.getAllHistory).toHaveBeenCalled();
  });

  it("should handle errors from getAllHistory", async () => {
    const mockError = new Error("mock error");
    (dbService.getAllHistory as jest.Mock).mockRejectedValue(mockError);
    console.error = jest.fn();

    await getAllHistory();

    expect(console.error).toHaveBeenCalledWith(mockError);
  });
});
