import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  pluginDir: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'dev',
  pluginDir: process.env.PLUGINS_DIR || path.resolve(process.cwd(), 'plugins'),
};

export default config;