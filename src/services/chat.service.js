
import { getAllHistory } from "./db.service.js";


export async function rename() {
  return getAllHistory()
    .then((message) => {
      return message;
    })
    .catch((err) => {
      console.error(err);
    });
}
