import { Module, Global } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-mssql';
import type { config } from 'mssql';
import * as schema from './schema';
import { ConfigService } from '@nestjs/config';

export const DRIZZLE = 'DRIZZLE';

/**
 * Parse semicolon-style connection string into mssql config so password
 * is a separate property (avoids # ; ( ) truncation when driver parses string).
 */
function parseConnectionStringToConfig(connectionString: string): config {
  const pairs: Record<string, string> = {};
  for (const part of connectionString.split(';')) {
    const eq = part.indexOf('=');
    if (eq <= 0) continue;
    const key = part.slice(0, eq).trim();
    let value = part.slice(eq + 1).trim();
    if ((value.startsWith("'") && value.endsWith("'")) || (value.startsWith('"') && value.endsWith('"'))) {
      value = value.slice(1, -1);
    }
    pairs[key] = value;
  }
  const serverPart = (pairs['Server'] ?? pairs['Data Source'] ?? '').trim();
  const [server, portStr] = serverPart.includes(',') ? serverPart.split(',') : [serverPart, '1433'];
  const port = parseInt(portStr, 10) || 1433;
  return {
    server: server.trim(),
    port,
    database: pairs['Database'] ?? pairs['Initial Catalog'] ?? '',
    user: pairs['User Id'] ?? pairs['User ID'] ?? pairs['UID'] ?? '',
    password: pairs['Password'] ?? pairs['PWD'] ?? '',
    options: {
      encrypt: (pairs['Encrypt'] ?? 'false').toLowerCase() === 'true',
      trustServerCertificate: (pairs['TrustServerCertificate'] ?? 'false').toLowerCase() === 'true',
    },
  };
}

/**
 * Build mssql config from env so password is always passed as a separate property
 * (avoids connection-string parsing issues with # ; ( ) in password).
 */
function getMssqlConfig(configService: ConfigService): config {
  const host = configService.get<string>('DB_HOST');
  const database = configService.get<string>('DB_DATABASE');
  const user = configService.get<string>('DB_USERNAME');
  const password = configService.get<string>('DB_PASSWORD');
  if (host && database && user && password !== undefined && password !== '') {
    const port = configService.get<number>('DB_PORT') || 1433;
    const encrypt = configService.get<string>('DB_ENCRYPT');
    const trustServerCertificate = configService.get<string>('DB_TRUST_SERVER_CERTIFICATE');
    return {
      server: host,
      port: Number(port) || 1433,
      database,
      user,
      password,
      options: {
        encrypt: encrypt === 'true' || encrypt === '1',
        trustServerCertificate: trustServerCertificate !== 'false' && trustServerCertificate !== '0',
      },
    };
  }
  const url = configService.get<string>('DATABASE_URL');
  if (url) return parseConnectionStringToConfig(url);
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
        const connection = getMssqlConfig(configService);
        if (configService.get('NODE_ENV') === 'development') {
          const len = connection.password?.length ?? 0;
          console.log(`[DB] Connecting: ${connection.server}:${connection.port}/${connection.database} as ${connection.user} (password length: ${len})`);
        }
        return drizzle({ connection, schema });
      },
    },
  ],
  exports: [DRIZZLE],
})
export class DatabaseModule {}
