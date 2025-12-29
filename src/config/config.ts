import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  bcryptSaltRounds: number;
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'dev',
  bcryptSaltRounds: Number.parseInt(process.env.BCRYPT_SALT_ROUNDS || '12'),
};

export default config;