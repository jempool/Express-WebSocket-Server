import topicService from "../services/topic.service.ts";

export async function getTodaysTopic(req, res) {
  return topicService
    .getTodaysTopic()
    .then((topic) => {
      return res.status(200).json(topic);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
}
