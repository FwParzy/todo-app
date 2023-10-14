import Task from "./Task";
import { TaskType } from '../types/taskTypes';

interface Props {
  tasks: TaskType[];
  toggleTask: any;
  category: string;
  editTaskName: (id: string, name: string) => void;
}

const TaskList = ({ tasks, toggleTask, category, editTaskName }: Props) => {
  return (
    tasks.filter(task => category === task.categoryId).map(task => {
      return <Task key={task.id} toggleTask={toggleTask} task={task} editTaskName={editTaskName} />
    })
  )
}

export default TaskList
