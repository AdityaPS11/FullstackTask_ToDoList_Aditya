// TaskItem.tsx

interface TaskItemProps {
  task: {
    _id: string;
    description: string;
  };
}

function TaskItem({ task }: TaskItemProps) {
  return <li className="mb-2">{task.description}</li>;
}

export default TaskItem;
