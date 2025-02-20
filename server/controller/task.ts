import { type NextFunction, type Request, type Response } from "express";
import { Db } from "mongodb";
import error from "../utils/error";
import {
  deleteTaskService,
  postTaskService,
  putTaskService,
} from "../service/task";

const getTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const db: Db | undefined = req.db;
  if (!db) {
    throw error("Database connection error", 500);
  }

  try {
    const tasks = await db.collection("task").find().toArray();
    res.status(200).json({ ...tasks });
  } catch (err) {
    next(err);
  }
};

const postTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const db: Db | undefined = req.db;
  if (!db) {
    throw error("Database connection error", 500);
  }

  try {
    const { title, description, category } = req.body;
    const createdTask = await postTaskService(db, title, description, category);
    res.status(201).json({ message: "Task created", ...createdTask });
  } catch (err) {
    next(err);
  }
};

const putTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const db: Db | undefined = req.db;
  if (!db) {
    throw error("Database connection error", 500);
  }

  try {
    const { id } = req.params;
    const { body } = req;

    const updateResult = await putTaskService(id, db, body);

    if (updateResult?.matchedCount === 0) {
      throw error("Task not found", 404);
    }

    res.status(200).json({ message: "Task updated successfully" });
  } catch (err) {
    next(err);
  }
};

const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const db: Db | undefined = req.db;
  if (!db) {
    throw error("Database connection error", 500);
  }

  try {
    const { id } = req.params;
    const deleteResult = await deleteTaskService(id, db);

    if (deleteResult?.deletedCount === 0) {
      throw error("Task not found", 404);
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export { getTask, postTask, putTask, deleteTask };
