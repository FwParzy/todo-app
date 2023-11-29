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
  const [initialized, setInitialized] = useState(false);

  // Init reordered tasks to only include current category
  useEffect(() => {
    const defaultTasks = [{
      id: 0,
      categoryId: 0,
      name: '0',
      completed: false,
      createTs: null,
      cancelTs: null,
      deleteTs: null
    }];

    const hasChanged = JSON.stringify(tasks) !== JSON.stringify(defaultTasks);
    if (!hasChanged) return;
    if (initialized) return;

    setReorderedTasks(tasks.filter(task => category === task.categoryId));
    setInitialized(true)
  }, [tasks]);

  const handleReorder = () => {
    console.log(' hihi ')
    console.log(reorderedTasks)
    // do post here to chnage the affected ordering
    // then we change the key from task id to task order?
  };

  
  return (
    <Reorder.Group
      axis="y"
      values={reorderedTasks}
      onReorder={setReorderedTasks}
    >
      {reorderedTasks.map((task) => (
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

