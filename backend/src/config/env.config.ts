import { getEnv } from "../utils/getEnv";

const envConfig = () => ({
  NODE_ENV: getEnv("NODE_ENV", "development"),

  PORT: getEnv("PORT", "4004"),
  BASE_PATH: getEnv("BASE_PATH", ""),
  MONGO_URI: getEnv("MONGO_URI"),
  APP_ORIGIN: getEnv("APP_ORIGIN"),

  JWT_SECRET: getEnv("JWT_SECRET"),
  JWT_REFRESH_SECRET: getEnv("JWT_REFRESH_SECRET"),

  EMAIL_SENDER: getEnv("EMAIL_SENDER"),
  RESEND_API_KEY: getEnv("RESEND_API_KEY"),
});

export const Env = envConfig();
