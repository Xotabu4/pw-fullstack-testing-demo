import { cleanEnv, url } from "envalid";

export const env = cleanEnv(process.env, {
  FRONTEND_URL: url({ default: "https://shopdemo-alex-hot.koyeb.app" }),
  API_URL: url({ default: "https://shopdemo-alex-hot.koyeb.app/api" }),
  DB_CONNECTION_URI: url({ default: undefined }),
});
