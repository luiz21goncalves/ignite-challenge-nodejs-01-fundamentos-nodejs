export const ENV = {
  DB_PATH: new URL(`../../${process.env.DB_PATH}`, import.meta.url),
  PORT: process.env.PORT,
}
