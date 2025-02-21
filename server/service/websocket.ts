import { Server } from "socket.io";
import http from "http";
import { Db, ObjectId } from "mongodb";
import websocketResponse from "../utils/sendWebsocketRes";
import error from "../utils/error";

export const setupWebSocket = (server: http.Server, db: Db) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
  });

  io.on("connection", async (socket) => {
    console.log(`User connected: ${socket.id}`);
    let email;
    socket.on("getTodoFor", async (user) => {
      email = user;
      if (!email) {
        throw error("user Not Found", 404);
      }
      try {
        // Response Initial data form database
        const data = await websocketResponse(db, email);
        socket.emit("todo", data ? data : []);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        socket.emit("todo", []);
      }
    });

    socket.on("update-todo", async (todo) => {
      const { id, title, description, category, email } = todo;
      try {
        if (!id || !title || !category || !email)
          throw error("Data Invalid", 404);
        await db
          .collection("todos")
          .updateOne(
            { _id: new ObjectId(id) },
            { $set: { title, description, category } },
            { upsert: true }
          );

        // send updated data
        const data = await websocketResponse(db, email);
        socket.emit("todo", data ? data : []);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        socket.emit("todo", []);
      }
    });

    socket.on("updated-todos", async (task) => {
      const { id, destCol, email } = task;

      if (!id) return;
      try {
        // updata on todos category
        await db
          .collection("todos")
          .updateOne(
            { _id: new ObjectId(id) },
            { $set: { category: destCol } },
            { upsert: true }
          );

        // send updated data
        const data = await websocketResponse(db, email);
        socket.emit("todo", data ? data : []);
      } catch (error) {
        console.error("Failed to update To-Do List:", error);
        socket.emit("update-error", "Failed to update To-Do List"); // Inform the client about the error
      }
    });

    socket.on("delete-todo", async (todo) => {
      const { id, userEmail } = todo;
      try {
        // Delete todo
        await db
          .collection("todos")
          .deleteOne({ _id: new ObjectId(id), userEmail });

        // send updated data
        const data = await websocketResponse(db, userEmail);
        socket.emit("todo", data ? data : []);
      } catch (error) {
        console.error("Failed to update To-Do List:", error);
        socket.emit("update-error", "Failed to update To-Do List"); // Inform the client about the error
      }
    });

    // Create New to-do
    socket.on("create-todo", async (todo) => {
      const { title, description, category, userEmail } = todo;
      if (!title || !category || !userEmail) return;
      try {
        // insert todo
        await db
          .collection("todos")
          .insertOne({ title, description, category, userEmail });

        // send updated data
        const data = await websocketResponse(db, userEmail);
        socket.emit("todo", data ? data : []);
      } catch (error) {
        console.error("Failed to update To-Do List:", error);
        socket.emit("update-error", "Failed to update To-Do List"); // Inform the client about the error
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};
