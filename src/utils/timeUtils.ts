import moment from 'moment';
import { TaskType } from '../types/taskTypes';

export function getCurrentTimestamp() {
  return moment().format('MM/DD/YYYY HH:mm:ss');
}

// Function to check if the day has changed since cancelTs was set
export function checkDayChange(cancelTs: string): string | null {
  const cancelMoment = moment(cancelTs, 'MM/DD/YYYY HH:mm:ss');
  if (cancelTs && moment().diff(cancelMoment, 'days') >= 1) {
    const deleteTs = getCurrentTimestamp();
    console.log(`deleteTs set to: ${deleteTs}`);
    return deleteTs;
  }
  return null;
}

export function setTaskDeleteTs(task: TaskType): TaskType {
  if (!task.cancelTs) {
    console.log(`no cancelTs Task ${task.name}`);
    return null;
  }
  const updatedDeleteTs = checkDayChange(task.cancelTs);
  if (!updatedDeleteTs) {
    console.log(`Task isnt old enough to delete ${task.name}`);
    return null;
  };

  console.log(`Deleted Task ${task.name}`);
  return {
    ...task,
    deleteTs: updatedDeleteTs
  }
}
