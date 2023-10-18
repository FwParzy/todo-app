export const handleEnterKey = (event:
  React.KeyboardEvent<HTMLInputElement |
  HTMLSelectElement>, callback: () => void) => {
  if (event.key === 'Enter') {
    callback();
  }
};
