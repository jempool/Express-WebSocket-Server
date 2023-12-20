import * as chatService from "../services/chat.service.ts";

export async function history(req, res) {
  return chatService
    .getAllHistory()
    .then((message) => {
      return res.status(200).json(message);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
}
