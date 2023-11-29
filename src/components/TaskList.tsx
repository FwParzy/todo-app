import Task from "./Task";
import { TaskType } from '../types/taskTypes';
import { Reorder } from "framer-motion"
import { useEffect, useState } from "react";

interface Props {
  tasks: TaskType[];
  category: number;
  onUpdateTask: () => void;
  onUpdateCategory: () => void;
}

const TaskList = ({ tasks, category, onUpdateTask, onUpdateCategory }: Props) => {
  const [reorderedTasks, setReorderedTasks] = useState<TaskType[]>([]);

  // Init reordered tasks to only include current category
  useEffect(() => {
    console.log('tasks -> ', tasks)
    //only do this once 
    setReorderedTasks(tasks.filter(task => category === task.categoryId));
  }, []);

  const handleReorder = () => {
    console.log(' hihi ')
    console.log(reorderedTasks)
  };

  
  return (
    <Reorder.Group
      axis="y"
      values={reorderedTasks}
      onReorder={setReorderedTasks}
    >
      {reorderedTasks.filter(task => category === task.categoryId).map((task) => (
        <Task
          key={task.id}
          task={task}
          onUpdateTask={onUpdateTask}
          onUpdateCategory={onUpdateCategory}
          handleReorder={handleReorder}
        />
      ))}
    </Reorder.Group>
  );
};

export default TaskList



    /*
     * Need to add a column that is called order
     * Put reorder.item inside task
     * 0 : {id: 26, userId: 1, categoryId: 5, name: 'Hotkey to close popups? maybe shift+enter', completed: 0, …}
     * 1 : {id: 22, userId: 1, categoryId: 5, name: 'Add the ability to rearrange the task order', completed: 0, …}
     * 2 : {id: 25, userId: 1, categoryId: 5, name: 'Better error clearing', completed: 0, …}
     * length : 3
     */

