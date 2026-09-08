import "dotenv/config";

const PORT = Number(process.env.PORT) || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";
const DATABASE_URL = process.env.DATABASE_URL;
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || "15m";

if (!JWT_ACCESS_SECRET) {
  throw new Error("JWT_ACCESS_SECRET is not defined");
}

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

export { PORT, NODE_ENV, DATABASE_URL ,JWT_ACCESS_SECRET,
JWT_ACCESS_EXPIRES_IN,};