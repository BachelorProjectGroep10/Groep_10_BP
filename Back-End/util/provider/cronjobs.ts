import fs from 'fs';
import path from 'path';

export default function initializeCronJobs() {
  const cronFolder = path.resolve(__dirname, '../cron'); 
  const cronFiles = fs.readdirSync(cronFolder); 
  
  cronFiles.forEach((file) => {
    if (file.endsWith('.ts')) {
      const cronJob = require(path.join(cronFolder, file)).default; 
      const cronInstance = new cronJob(); 
      cronInstance.init(); 
    }
  });

  console.log('All cron jobs initialized.');
}
