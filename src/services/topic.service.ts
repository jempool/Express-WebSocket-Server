import { Topic } from "../models/topic.model.ts";
import * as dbService from "./db.service.ts";

export default {
  getAllTopics: async function () {
    return await Topic.find();
  },

  getTodaysTopic: async function () {
    const now = new Date();
    const today = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
    );
    return await dbService.getTopicByDate(today);
  },
};
