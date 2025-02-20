import { Db } from "mongodb";
import { type NextFunction, type Request, type Response } from "express";
import error from "../utils/error";
import { createUser, findUser } from "../service/user";

const postUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const db: Db | undefined = req.db;

  // Check if database connection is available
  if (!db) {
    throw error("Database connection is not available", 500);
  }

  try {
    const { email, userId, name } = req.body;

    // Validate request body
    if (!email || !userId || !name) {
      throw error("Invalid Info", 400); // Use 400 (Bad Request)
    }

    // Check if the user already exists
    const user = await findUser(db, email);
    if (user) {
      throw error("User already exists", 400);
    }

    // Create the new user
    const newUser = await createUser(db, { userId, email, name });

    res.status(201).json({ message: "User created successfully", ...newUser });
  } catch (err) {
    next(err);
  }
};

export { postUser };
