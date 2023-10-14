import { handleEnterKey } from '../utils/keyboardUtils';

type Props = {
  inputRef: React.RefObject<HTMLInputElement>;
  onCancel: () => void;
  onAdd: () => void;
};

const NewTask = ({ inputRef, onCancel, onAdd }: Props) => {

  return (
    <div>
      <input
        ref={inputRef}
        type="text"
        name="inputCategory"
        placeholder="Enter Task"
        onKeyDown={(e) => handleEnterKey(e, onAdd)}
        autoFocus
      />
      <button onClick={onCancel}>Cancel</button>
      <button onClick={onAdd}>Add</button>
    </div>
  )
}

export default NewTask
