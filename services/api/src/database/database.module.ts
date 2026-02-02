import { Module, Global } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-mssql';
import * as schema from './schema';
import { ConfigService } from '@nestjs/config';

export const DRIZZLE = 'DRIZZLE';

function getConnectionUrl(config: ConfigService): string {
  const url = config.get<string>('DATABASE_URL');
  if (url) return url;
  const host = config.get<string>('DB_HOST');
  const database = config.get<string>('DB_DATABASE');
  const user = config.get<string>('DB_USERNAME');
  const password = config.get<string>('DB_PASSWORD');
  if (host && database && user && password) {
    const port = config.get<number>('DB_PORT') || 1433;
    return `Server=${host},${port};Database=${database};User Id=${user};Password=${password};Encrypt=false;TrustServerCertificate=true`;
  }
  throw new Error(
    'Database connection required: set DATABASE_URL or DB_HOST, DB_DATABASE, DB_USERNAME, DB_PASSWORD in .env',
  );
}

@Global()
@Module({
  providers: [
    {
      provide: DRIZZLE,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const url = getConnectionUrl(configService);
        return drizzle(url, { schema });
      },
    },
  ],
  exports: [DRIZZLE],
})
export class DatabaseModule {}
