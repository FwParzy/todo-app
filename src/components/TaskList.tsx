import Task from "./Task";
import { TaskType, ToggleTaskFunction } from '../types/taskTypes';

interface Props {
  tasks: TaskType[];
  category: number;
  onUpdateTask: () => void;
}

const TaskList = ({ tasks, category, onUpdateTask }: Props) => {
  return (
    tasks.filter(task => category === task.categoryId).map(task => {
      return <Task key={task.id} task={task} onUpdateTask={onUpdateTask} />
    })
  )
}

export default TaskList
