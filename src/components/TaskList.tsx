import Task from "./Task";
import { TaskType } from '../types/taskTypes';
import { Reorder, motion, useDragControls, useMotionValue} from "framer-motion"
import { ReactHTML, useEffect, useState } from "react";
import { useRaisedShadow } from "./use-raised-shadow";

interface Props {
  tasks: TaskType[];
  category: number;
  onUpdateTask: () => void;
  onUpdateCategory: () => void;
}

const TaskList = ({ tasks, category, onUpdateTask, onUpdateCategory }: Props) => {
const [reorderedTasks, setReorderedTasks] = useState<TaskType[]>([]);
  const y = useMotionValue(0);
  const boxShadow = useRaisedShadow(y);
  const dragControls = useDragControls();

  useEffect(() => {
    setReorderedTasks(tasks.filter(task => category === task.categoryId));
  }, [tasks, category]);

  const handleReorder = (newOrder: TaskType[]) => {
    setReorderedTasks(newOrder);
    console.log(newOrder)

    /*
     * Need to add a column that is called order
     * Put reorder.item inside task
     * 0 : {id: 26, userId: 1, categoryId: 5, name: 'Hotkey to close popups? maybe shift+enter', completed: 0, …}
     * 1 : {id: 22, userId: 1, categoryId: 5, name: 'Add the ability to rearrange the task order', completed: 0, …}
     * 2 : {id: 25, userId: 1, categoryId: 5, name: 'Better error clearing', completed: 0, …}
     * length : 3
     */
  };

  return (
    <Reorder.Group axis="y" values={reorderedTasks} onReorder={handleReorder}>
      {reorderedTasks.map(task => (
        <Reorder.Item
          key={task.id}
          value={task}
          style={{ boxShadow, y }}
          dragControls={dragControls}
          as={motion.div as undefined as keyof ReactHTML}>
          <Task task={task} onUpdateTask={onUpdateTask} onUpdateCategory={onUpdateCategory} />
        </Reorder.Item>
      ))}
    </Reorder.Group>
  );
};

export default TaskList
