import Task from "./Task";
import { TaskType } from '../types/taskTypes';

interface Props {
  tasks: TaskType[];
  toggleTask: any;
  category: string;
  editTask: (updatedTask: TaskType) => void;
}

const TaskList = ({ tasks, toggleTask, category, editTask }: Props) => {
  return (
    tasks.filter(task => category === task.categoryId).map(task => {
      return <Task key={task.id} toggleTask={toggleTask} task={task} editTask={editTask} />
    })
  )
}

export default TaskList
