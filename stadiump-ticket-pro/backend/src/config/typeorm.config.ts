import { DataSource, DataSourceOptions } from 'typeorm';

const url = process.env.DATABASE_URL || 'postgresql://postgres:example@localhost:5432/tickets';

export function typeOrmConfig(): DataSourceOptions {
  return {
    type: 'postgres',
    url,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    synchronize: process.env.NODE_ENV === 'development' && !process.env.RUN_MIGRATIONS,
    logging: process.env.NODE_ENV === 'development',
  };
}

const dataSource = new DataSource({
  ...typeOrmConfig(),
  migrations: [__dirname + '/../migrations/*.ts'],
});
export default dataSource;
