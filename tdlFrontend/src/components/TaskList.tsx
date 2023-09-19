// TaskList.tsx
import { useEffect, useState } from 'react';
import TaskItem from './TaskItem';
import { fetchAllTasks } from '../api';

interface Task {
  _id: string;
  description: string;
}

function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchAllTasks();
        console.log('Fetched data:', data);
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    }

    fetchData();
  }, []); 
  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-2">Notes</h2>
      <ul className="flex flex-col gap-4">
        {tasks.map((task) => (
          <div key={task._id} className="border-t border-b border-gray-300 py-4 flex-grow">
            <TaskItem task={task} />
          </div>
        ))}
      </ul>
    </div>
  );
}

export default TaskList;
