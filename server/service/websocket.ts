import { Server } from "socket.io";
import http from "http";
import { Db, ObjectId } from "mongodb";

export const setupWebSocket = (server: http.Server, db: Db) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
  });

  io.on("connection", async (socket) => {
    console.log(`User connected: ${socket.id}`);

    try {
      const initialTodoData = await db.collection("todos").find().toArray();
      const todo = initialTodoData.filter((item) => item.category === "todo");
      const inprogress = initialTodoData.filter(
        (item) => item.category === "inProgress"
      );
      const complete = initialTodoData.filter(
        (item) => item.category === "completed"
      );
      const data = {
        todo: todo,
        inProgress: inprogress,
        completed: complete,
      };
      socket.emit("todo", initialTodoData ? data : []);
    } catch (error) {
      console.error("Error fetching initial data:", error);
      socket.emit("todo", []);
    }

    socket.on("updated-todos", async (task) => {
      const { id, sourceCol, destCol } = task;

      if (!id) return;
      try {
        const result = await db
          .collection("todos")
          .updateOne(
            { _id: new ObjectId(id) },
            { $set: { category: destCol } },
            { upsert: true }
          );

        // io.emit("todo-updated", updatedTodoData ? updatedTodoData.todos : []); // Emit the actual data
      } catch (error) {
        console.error("Failed to update To-Do List:", error);
        socket.emit("update-error", "Failed to update To-Do List"); // Inform the client about the error
      } finally {
        const updatedTodoData = await db.collection("todos").find().toArray();
        const todo = updatedTodoData.filter((item) => item.category === "todo");
        const inprogress = updatedTodoData.filter(
          (item) => item.category === "inProgress"
        );
        const complete = updatedTodoData.filter(
          (item) => item.category === "completed"
        );
        const data = {
          todo: todo,
          inProgress: inprogress,
          completed: complete,
        };
        socket.emit("todo", updatedTodoData ? data : []);
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};
