import type { Db } from "mongodb";

const websocketResponse = async (db: Db, email: string) => {
  const initialTodoData = await db
    .collection("todos")
    .find({ userEmail: email })
    .toArray();
  const todo = initialTodoData.filter((item) => item.category === "todo");
  const inprogress = initialTodoData.filter(
    (item) => item.category === "inProgress"
  );
  const complete = initialTodoData.filter(
    (item) => item.category === "completed"
  );
  return {
    todo: todo,
    inProgress: inprogress,
    completed: complete,
  };
};

export default websocketResponse;
