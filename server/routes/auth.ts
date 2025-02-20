import { Router } from "express";
import { postUser } from "../controller/user";

const route = Router();

route.post("/createUser", postUser);

export default route;
