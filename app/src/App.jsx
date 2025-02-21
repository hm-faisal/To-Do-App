import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { io } from "socket.io-client";
import { FaRegTrashAlt } from "react-icons/fa";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import Modal from "./components/Modal";
import AddModal from "./components/Modal";
import useAuth from "./hooks/useAuth";
import LoadingSkeleton from "./components/Loding";
import LoginPage from "./components/SignIn";

const socket = io("http://localhost:5000");

const TodoApp = () => {
  const { loading, user } = useAuth();

  const [tasks, setTasks] = useState({});
  const [close, setClose] = useState(true);
  const [addModelClose, setAddModelClose] = useState(true);
  const [modelData, setModelData] = useState("");
  const [addModelData, setAddModelData] = useState("");
  const [modelId, setModalId] = useState(null);

  console.log(tasks);

  useEffect(() => {
    // Listen for To-Do list updates from backend
    if (!user) return;
    socket.emit("getTodoFor", user?.email);
    socket.on("todo", (updatedTodos) => {
      setTasks({ ...updatedTodos });
    });

    return () => {
      socket.off("todo-updated");
    };
  }, [user]);

  // Update todo
  useEffect(() => {
    if (!modelId) return;
    socket.emit("update-todo", {
      ...modelData,
      id: modelId,
      email: user?.email,
    });
  }, [modelData]);

  // Update Todo Category
  const [updateTaskInfo, setUpdateTaskInfo] = useState({});
  useEffect(() => {
    socket.emit("updated-todos", { ...updateTaskInfo, email: user?.email });
  }, [updateTaskInfo]);

  // Delete todo
  const [deleteTask, setDeleteTask] = useState("");
  useEffect(() => {
    if (!deleteTask) return;
    socket.emit("delete-todo", { id: deleteTask, userEmail: user?.email });
  }, [deleteTask]);
  console.log(deleteTask);

  // Create todo
  useEffect(() => {
    if (!addModelData) return;
    socket.emit("create-todo", { ...addModelData, userEmail: user?.email });
  }, [addModelData]);

  const openModal = () => {
    setClose(false);
  };

  const openAddModal = () => {
    setAddModelClose(false);
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return; // Drop outside of the list

    const sourceCol = source.droppableId;
    const destCol = destination.droppableId;

    // Copy current column tasks
    const updatedTasks = { ...tasks };

    if (sourceCol === destCol) {
      // Reorder items within the same column
      const columnItems = Array.from(updatedTasks[sourceCol]);
      const [movedItem] = columnItems.splice(source.index, 1); // Remove item
      columnItems.splice(destination.index, 0, movedItem); // Insert at new position

      updatedTasks[sourceCol] = columnItems;
    } else {
      // Moving across different columns
      const sourceItems = Array.from(updatedTasks[sourceCol]);
      const destItems = Array.from(updatedTasks[destCol]);

      const [movedItem] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, movedItem);

      updatedTasks[sourceCol] = sourceItems;
      updatedTasks[destCol] = destItems;

      setUpdateTaskInfo({ id: movedItem._id, sourceCol, destCol });
    }

    setTasks(updatedTasks);
  };

  if (!user) {
    return <LoginPage />;
  }
  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <>
      <Modal
        btn_label={"Update"}
        close={close}
        setClose={setClose}
        setModelData={setModelData}
      />
      <AddModal
        close={addModelClose}
        setClose={setAddModelClose}
        setModelData={setAddModelData}
      />
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 mt-4  max-w-11/12 mx-auto">
          {Object.keys(tasks).map((columnKey) => (
            <Droppable key={columnKey} droppableId={columnKey}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="w-1/3 p-4 bg-gray-100 rounded-lg"
                >
                  <h2 className="text-lg font-bold mb-2 flex justify-between items-center">
                    {columnKey.toUpperCase()}
                    <span>
                      <button
                        type="button"
                        onClick={() => {
                          openAddModal();
                        }}
                      >
                        +
                      </button>
                    </span>
                  </h2>
                  {tasks[columnKey].map((task, index) => (
                    <Draggable
                      key={task._id}
                      draggableId={task._id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="p-2 bg-white rounded shadow mb-2 flex justify-between items-center"
                        >
                          <span>{task.title}</span>
                          <span className="space-x-2">
                            <button
                              type="button"
                              onClick={() => {
                                openModal();
                                setModalId(task._id);
                              }}
                            >
                              <HiOutlinePencilSquare />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteTask(task._id)}
                            >
                              <FaRegTrashAlt />
                            </button>
                          </span>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </>
  );
};

export default TodoApp;
