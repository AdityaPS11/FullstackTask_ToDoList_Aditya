// TaskForm.tsx
import { useState } from 'react';
import { addTask } from '../api';

function TaskForm() {
  const [newTask, setNewTask] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTask) return;

    await addTask(newTask);

    // Clear the input field after adding the task
    setNewTask('');
  };

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-2">📜 Note App</h2>
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          placeholder="Add a new note..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="flex-grow p-2 mr-2 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="bg-yellow-700 text-white px-4 py-2 rounded hover:bg-yellow-900 flex items-center font-bold"
        >
            <div className="w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center">
            <span className=" text-yellow-700 flex items-center justify-center">+</span>
            </div>
            Add
        </button>
      </form>
    </div>
  );
}

export default TaskForm;
