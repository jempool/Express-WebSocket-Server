jest.mock("../src/services/db.service", () => ({
  getAllHistory: jest.fn()
}));

const dbService = require("../src/services/db.service");
const { getAllHistory } = require("../src/services/chat.service");

describe("getAllHistory function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return the result of getAllHistory", async () => {
    const mockMessage = [
      {
        message: "Hi",
        handle: "testUser"
      },
      {
        message: "Hello!",
        handle: "testUser"
      }
    ];
    dbService.getAllHistory.mockResolvedValue(mockMessage);

    const result = await getAllHistory();

    expect(result).toEqual(mockMessage);
    expect(dbService.getAllHistory).toHaveBeenCalled();
  });

  it("should handle errors from getAllHistory", async () => {
    const mockError = new Error("mock error");
    dbService.getAllHistory.mockRejectedValue(mockError);
    console.error = jest.fn();

    await getAllHistory();

    expect(console.error).toHaveBeenCalledWith(mockError);
  });
});
