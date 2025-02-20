import { Router } from "express";
import auth from "./auth";
import task from "./task";

const routes = Router();

routes.use("/auth", auth);
routes.use("/task", task);

export default routes;
