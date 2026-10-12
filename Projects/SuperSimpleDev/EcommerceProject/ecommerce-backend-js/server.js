import app from './app.js';
import { initializeDatabase } from './initializeDatabase.js';

const PORT = process.env.PORT || 3000;

await initializeDatabase();
/** Starts the API after the database schema and initial catalog are ready. */
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
