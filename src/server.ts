import app from './app';
import config from './config/config';

(async function bootstrap() {
  try {
    // todo - any initialization here

    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  } catch (e) {
    console.error('Failed to start', e);
    process.exit(1);
  }
})();