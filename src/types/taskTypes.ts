export type TaskType = {
  id: number;
  categoryId: number;
  name: string;
  completed: boolean | number;
  createTs: string,
  cancelTs: string,
  deleteTs: string
}

export type ToggleTaskFunction = ( id: string) => void;
