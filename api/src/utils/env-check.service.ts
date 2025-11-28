import Joi from "joi";

const envSchema = Joi.object({
  // API essentials
  PORT: Joi.number().integer().min(1).max(65535).default(3000),
  NODE_ENV: Joi.string()
    .valid("development", "production", "test")
    .default("development"),

  // Database
  MONGODB_URI: Joi.string().required(),

  // JWT
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default("7d"),

  // Session
  SESSION_SECRET: Joi.string().required(),

  // Google OAuth
  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),
  GOOGLE_CALLBACK_URL: Joi.string().required(),

  // Client URL (for redirects)
  CLIENT_URL: Joi.string().default("http://localhost:8081"),
}).unknown(true);

export default function validateEnv() {
  const { error } = envSchema.validate(process.env);
  if (error) {
    throw new Error(
      `Environment validation error: ${error.details[0].message}`
    );
  }
  console.log("✅ Environment variables validated");
}
