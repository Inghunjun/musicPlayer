import "dotenv/config.js";
import { TypeOrmModuleOptions } from '@nestjs/typeorm'
function ormConfig(): TypeOrmModuleOptions {
  const commonConf = {
    SYNCRONIZE: false,
    ENTITIES: [__dirname + '/entities/*{.ts,.js}'],
    MIGRATIONS: [__dirname + '/migrations/**/*{.ts,.js}'],
    MIGRATIONS_RUN: false,
  }
  //npm i @nestjs/typeorm typeorm mysql2
  return {
    name: 'default',
    type: 'mysql',
    database: 'soundcloud',
    host: 'localhost',
    port: Number(3306),
    username: process.env.ORM_USERNAME,
    password: process.env.ORM_PASSWORD,
    logging: true,
    synchronize: commonConf.SYNCRONIZE,
    entities: commonConf.ENTITIES,
    migrations: commonConf.MIGRATIONS,
    migrationsRun: commonConf.MIGRATIONS_RUN,
  }
}

export { ormConfig };
