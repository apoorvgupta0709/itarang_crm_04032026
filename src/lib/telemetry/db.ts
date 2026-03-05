import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { sql } from 'drizzle-orm';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
}

const queryClient = postgres(connectionString, {
    ssl: 'require',
    prepare: false,
});

export const telemetryDb = drizzle(queryClient);

export { sql };
