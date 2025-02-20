import { Db } from "mongodb";
import error from "../utils/error";

type User = {
  userId: any;
  email: string;
  name: string;
};

const createUser = (db: Db, { userId, email, name }: User) => {
  if (!db) {
    throw error("Database connection is not available", 500);
  }
  return db?.collection("users").insertOne({ userId, email, name });
};

const findUser = async (db: Db, email: string) => {
  if (!db) {
    throw error("Database connection is not available", 500);
  }
  return db.collection("users").findOne({ email });
};

export { createUser, findUser };
