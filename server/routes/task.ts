import { Router } from "express";
import { deleteTask, getTask, postTask, putTask } from "../controller/task";

const route = Router();

route.put("/:id", putTask);
route.delete("/:id", deleteTask);
route.get("/", getTask);
route.post("/", postTask);

export default route;
