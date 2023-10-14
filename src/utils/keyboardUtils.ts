export const handleEnterKey = (event: React.KeyboardEvent<HTMLInputElement>, callback: () => void) => {
  if (event.key === 'Enter') {
    callback();
  }
};
