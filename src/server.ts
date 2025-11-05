import app from './app';
import config from './config/config';

import accountService from './services/account.service';

const services = [
  accountService
];

async function initializeServices() {
  for (const service of services) {
    if (typeof service.initialize === 'function') {
      await service.initialize();
    }
  }
}

// initialize services and start listening
(async function bootstrap() {
  try {
    await initializeServices();

    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  } catch (e) {
    console.error('Failed to start', e);
    process.exit(1);
  }
})();