// api.ts
const API_BASE_URL = 'http://localhost:3000/api/tasks';

export interface Task {
    _id: string;
    description: string;
  }

export async function addTask(description: string) {
  const response = await fetch(`${API_BASE_URL}/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ description }),
  });

  if (!response.ok) {
    throw new Error('Failed to add task.');
  }
}

export async function fetchAllTasks(): Promise<Task[]> {
  const response = await fetch(`${API_BASE_URL}/fetchAllTasks`);

  if (!response.ok) {
    throw new Error('Failed to fetch tasks.');
  }

  const data: Task[] = await response.json();
  return data;
}
