// api/index.ts
import serverless from 'serverless-http';

// Import the app using named import if it's not a default export
import { app } from '../src/app'; // Adjust this line based on the actual export

export default serverless(app);
