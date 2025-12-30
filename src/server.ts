import 'dotenv/config';
import app from './app';
import appBootstrap from './bootstrap/app.bootstrap';
import config from './config/config';

(async function start() {
  try {
    console.log(`Starting service with env: ${process.env.NODE_ENV}`);
    await appBootstrap.run();
    console.log('Bootstrap completed');

    const server = app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });

    server.on('error', (err: any) => {
      console.error('HTTP server error:', err);
    });
  } catch (e) {
    console.error('Failed to start', e);
    process.exit(1);
  }
})();