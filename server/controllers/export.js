export const getMd = (req, res) => {
  const { categories, tasks } = req.body;

  let markdownContent = '';

  for (const category of categories) {
    markdownContent += `## ${category.name}\n`;

    const categoryTasks = tasks.filter(task => task.categoryId === category.id);

    for (const task of categoryTasks) {
      const checkbox = task.completed ? '[x]' : '[ ]';
      markdownContent += `- ${checkbox} ${task.name}\n`;
    }

    markdownContent += '\n';
  }

  res.setHeader('Content-Disposition', 'attachment; filename=notes.md');
  res.setHeader('Content-Type', 'text/markdown');
  res.send(markdownContent);;
}
