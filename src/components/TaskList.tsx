import Task from "./Task";
import { TaskType } from '../types/taskTypes';

interface Props {
  tasks: TaskType[];
  category: number;
  onUpdateTask: () => void;
  onUpdateCategory: () => void;
}

const TaskList = ({ tasks, category, onUpdateTask, onUpdateCategory }: Props) => {
  return (
    tasks.filter(task => category === task.categoryId).map(task => {
      return <Task key={task.id} task={task} onUpdateTask={onUpdateTask} onUpdateCategory={onUpdateCategory} />
    })
  )
}

export default TaskList
