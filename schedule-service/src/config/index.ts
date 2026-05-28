// import { redisStore } from 'cache-manager-redis-yet';
import * as dotenv from 'dotenv';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (!envFound) {
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default () => ({
  app: {
    // env: process.env.NODE_ENV,
    name: process.env.SERVICE_NAME,
  },
  port: process.env.PORT || 8000,
  dbConfig: {
    url: `postgresql://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    // type: 'postgres',
    // entities: [__dirname + '/../**/entities/*.entity{.ts,.js}'],
    // synchronize: false,
    // bigNumberStrings: false,
    // supportBigNumbers: true,
    // host: process.env.DB_HOST,
    // port: Number(process.env.DB_PORT),
    // username: process.env.DB_USERNAME,
    // password: process.env.DB_PASSWORD,
    // database: process.env.DB_NAME,
    // poolSize: Number(process.env.DB_POOL_SIZE),
    // replication: {
    //   master: {
    //     host: process.env.DBHOST,
    //     port: Number(process.env.DBPORT),
    //     username: process.env.DBUSER,
    //     password: process.env.DBPASSWORD,
    //     database: process.env.DBNAME,
    //     poolSize: Number(process.env.DBPOOL),
    //   },
    //   slaves: [
    //     {
    //       host: process.env.DBHOST_SLAVES,
    //       port: Number(process.env.DBPORT_SLAVES),
    //       username: process.env.DBUSER_SLAVES,
    //       password: process.env.DBPASSWORD_SLAVES,
    //       database: process.env.DBNAME_SLAVES,
    //       poolSize: Number(process.env.DBPOOL_SLAVES),
    //     },
    //   ],
    // },
  },
  cache: {
    // store: redisStore,
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: Number(process.env.REDIS_PORT) || 6379,
    socket: {},
    password: process.env.REDIS_PASSWORD || '',
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRED,
  },
  email: {
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
  },
});
