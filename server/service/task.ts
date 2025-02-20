import error from "../utils/error";
import { Db, ObjectId } from "mongodb";

const postTaskService = (
  db: Db | undefined,
  title: string,
  description: string,
  category: string
) => {
  if (!title || !description || !category) {
    throw error("Invalid input data", 400);
  }

  return db?.collection("task").insertOne({ title, description, category });
};

const putTaskService = (
  id: string,
  db: Db | undefined,
  body: { title?: string; description?: string; category?: string }
) => {
  if (!ObjectId.isValid(id)) {
    throw error("Invalid task ID", 400);
  }

  return db
    ?.collection("task")
    .updateOne({ _id: new ObjectId(id) }, { $set: body }, { upsert: false });
};

const deleteTaskService = (id: string, db: Db | undefined) => {
  if (!ObjectId.isValid(id)) {
    throw error("Invalid task ID", 400);
  }

  return db?.collection("task").deleteOne({ _id: new ObjectId(id) });
};

export { postTaskService, putTaskService, deleteTaskService };
