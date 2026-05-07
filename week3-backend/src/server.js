const { createApp } = require('./app');

const PORT = process.env.PORT || 4000;
const DB_FILE = process.env.DB_FILE || './week3.sqlite';

const app = createApp({ dbFile: DB_FILE });

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
