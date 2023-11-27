import mysql from 'mysql';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter MySQL username: ', (username) => {
  rl.question('Enter MySQL password: ', (password) => {
    const connection = mysql.createConnection({
      host: 'localhost',
      user: username,
      password: password,
      database: 'todo'
    });

    const alterTableQuery = `ALTER TABLE tasks ADD COLUMN \`order\` INT NULL AFTER categoryId;`;

    connection.connect(err => {
      if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
      }

      console.log('Connected to MySQL.');

      connection.query(alterTableQuery, (err, _results) => {
        if (err) {
          console.error('Error executing query:', err);
          return;
        }
        console.log('Successfully added "order" column to "tasks" table.');
        connection.end(() => {
          rl.close();
        });
      });
    });
  });
});
