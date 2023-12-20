import * as dbService from "./db.service.ts";

export async function getAllHistory() {
  return dbService
    .getAllHistory()
    .then((message) => {
      return message;
    })
    .catch((err) => {
      console.error(err);
    });
}
