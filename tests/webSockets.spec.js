const http = require("http");
const { io: Client } = require("socket.io-client");
const { socketIO } = require("../src/webSockets/webSockets.ts");
const dbService = require("../src/services/db.service.ts");

jest.mock("../src/services/db.service.ts");

describe("socketIO", () => {
  let httpServer;
  let clientSocket;
  const incomingMessage = { message: "Hello, World!", handle: "John Doe" };

  beforeAll((done) => {
    dbService.addMessage = jest.fn((data) => {
      return Promise.resolve(data);
    });

    httpServer = new http.Server();
    socketIO(httpServer);
    httpServer.listen(() => {
      clientSocket = Client(`http://localhost:${httpServer.address().port}`);
      clientSocket.on("connect", done);
    });
  });

  afterAll(() => {
    httpServer.close();
    clientSocket.close();
  });

  it("should emit chat event", (done) => {
    clientSocket.on("chat", (message) => {
      expect(message).toEqual(incomingMessage);
      done();
    });

    clientSocket.emit("chat", incomingMessage);
  });

  it("should emit typing event", (done) => {
    clientSocket.on("typing", (message) => {
      expect(message).toEqual(incomingMessage);
      done();
    });

    clientSocket.emit("typing", incomingMessage);
  });
});
