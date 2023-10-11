import { useState } from "react";

interface Props {
  onSubmit: () => void;
  onClose: () => void;
}

const NewTask = ({ onSubmit, onClose }: Props) => {

  const [visible, setVisible] = useState(false)

const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
};

  return (
    <form action="/NewTask" onSubmit={handleSubmit} className="alert-dismissible" >
      <input type="text" className="form-control" placeholder="Enter Task..." />
      <input 
        type="reset" 
        value="CANCEL" 
        className="btn btn-secondary"
        onClick={(e) => {
          e.preventDefault();
          onClose();
        }} 
      />
      <input className="btn btn-success" type="submit" onSubmit={handleSubmit} value="OK" />
    </form>
  )
}

export default NewTask

