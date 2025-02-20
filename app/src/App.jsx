import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const initialTasks = {
  todo: [
    { id: "1", content: "Task 1" },
    { id: "2", content: "Task 2" },
  ],
  inProgress: [{ id: "3", content: "Task 3" }],
  completed: [{ id: "4", content: "Task 4" }],
};

const TodoApp = () => {
  const [tasks, setTasks] = useState(initialTasks);
  console.log(tasks);

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
    }

    setTasks(updatedTasks);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 p-4">
        {Object.keys(tasks).map((columnKey) => (
          <Droppable key={columnKey} droppableId={columnKey}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="w-1/3 p-4 bg-gray-100 rounded-lg"
              >
                <h2 className="text-lg font-bold mb-2">
                  {columnKey.toUpperCase()}
                </h2>
                {tasks[columnKey].map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="p-2 bg-white rounded shadow mb-2"
                      >
                        {task.content}
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
  );
};

export default TodoApp;
