const App = ({ btn_label, setClose, close, setModelData }) => {
  const handleModal = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    setModelData(data);
    setClose(true);
  };
  return (
    <div
      className={`${
        close ? "hidden" : "block"
      } absolute w-full h-full flex justify-center items-center bg-[rgba(0,0,0,0.3)]`}
    >
      <form
        className="max-w-sm flex flex-col gap-4 bg-white p-8 rounded-xl"
        onSubmit={handleModal}
      >
        <div className="">
          <label htmlFor="todo-title" className="block font-semibold text-lg ">
            Title
          </label>
          <input
            type="text"
            name="title"
            className="border py-2 px-4 rounded"
          />
        </div>
        <div className="">
          <label
            htmlFor="todo-description"
            className="block font-semibold text-lg "
          >
            Description
          </label>
          <textarea
            name="description"
            className="border py-2 px-4 rounded w-full"
          ></textarea>
        </div>
        <div className="">
          <label htmlFor="category" className="block font-semibold text-lg ">
            Category
          </label>
          <select
            name="category"
            className="w-full p-2 border rounded border-gray-400"
          >
            <option value="todo">To-Do</option>
            <option value="inProgress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <button
          type="submit"
          className="px-4 py-2 border border-gray-200 rounded bg-indigo-700 text-lg font-bold text-white"
        >
          {btn_label ? btn_label : "Add To Do"}
        </button>
      </form>
    </div>
  );
};

export default App;
