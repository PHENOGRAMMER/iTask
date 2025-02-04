import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import { v4 as uuidv4 } from "uuid";
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";

function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [showFinished, setShowFinished] = useState(true);

  // Load todos from local storage on mount
  useEffect(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // Update local storage whenever todos change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const handleChange = (e) => setTodo(e.target.value);

  const toggleFinished = () => setShowFinished(!showFinished);

  const handleAdd = () => {
    if (todo.trim().length > 3) {
      setTodos((prevTodos) => [...prevTodos, { id: uuidv4(), todo, isCompleted: false }]);
      setTodo(""); // Clear input field
    }
  };

  const handleCheckbox = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((item) =>
        item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
      )
    );
  };

  const handleEdit = (id) => {
    const taskToEdit = todos.find((item) => item.id === id);
    if (taskToEdit) {
      setTodo(taskToEdit.todo);
      setTodos((prevTodos) => prevTodos.filter((item) => item.id !== id));
    }
  };

  const handleDelete = (id) => {
    setTodos((prevTodos) => prevTodos.filter((item) => item.id !== id));
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto my-10 p-6 bg-gray-800 text-white rounded-xl shadow-lg">
        <h1 className="text-4xl font-bold text-center mb-6">iTask - Manage Your Tasks with Ease</h1>

        {/* Input Field & Add Button */}
        <div className="addTodo mb-6">
          <h2 className="text-lg font-semibold mb-2">Add A Todo</h2>
          <div className="flex items-center">
            <input
              onChange={handleChange}
              value={todo}
              type="text"
              placeholder="Enter a task"
              className="w-full px-4 py-2 text-black rounded-md shadow focus:outline-none"
            />
            <button
              onClick={handleAdd}
              disabled={todo.trim().length <= 3}
              className="ml-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-md font-bold text-white transition disabled:bg-gray-600"
            >
              ADD
            </button>
          </div>
        </div>

        {/* Show Finished Checkbox */}
        <div className="mb-4 flex items-center">
          <input type="checkbox" checked={showFinished} onChange={toggleFinished} className="mr-2" />
          <label>Show Finished</label>
        </div>

        {/* Todo List */}
        <h2 className="text-lg font-semibold mb-4">Your Todos</h2>
        <div className="todos">
          {todos.length === 0 ? (
            <div className="text-gray-400 text-center">No Todos To Display</div>
          ) : (
            todos.map((item) =>
              showFinished || !item.isCompleted ? (
                <div key={item.id} className="todo flex justify-between items-center py-2 px-4 bg-gray-700 rounded-lg shadow-md mb-3">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={item.isCompleted} onChange={() => handleCheckbox(item.id)} />
                    <span className={`${item.isCompleted ? "line-through text-gray-400" : ""}`}>{item.todo}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleEdit(item.id)} className="p-2 rounded-md bg-yellow-500 hover:bg-yellow-600 transition">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 rounded-md bg-red-600 hover:bg-red-700 transition">
                      <AiFillDelete />
                    </button>
                  </div>
                </div>
              ) : null
            )
          )}
        </div>
      </div>
    </>
  );
}

export default App;
