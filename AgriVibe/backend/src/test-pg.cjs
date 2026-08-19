const { Client } = require('pg');
require('dotenv').config();

const config = {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME || 'agrivibe',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || process.env.PGPASSWORD || 'postgres'
};

async function ensureDatabase() {
    const adminClient = new Client({
        ...config,
        database: 'postgres'
    });

    try {
        await adminClient.connect();
        const result = await adminClient.query(
            'SELECT 1 FROM pg_database WHERE datname = $1',
            [config.database]
        );

        if (result.rowCount === 0) {
            const safeDbName = config.database.replace(/"/g, '""');
            await adminClient.query(`CREATE DATABASE "${safeDbName}"`);
            console.log(`✅ Created database "${config.database}"`);
        }

        await adminClient.end();
    } catch (error) {
        await adminClient.end();
        throw error;
    }
}

async function main() {
    await ensureDatabase();

    const client = new Client(config);
    try {
        await client.connect();
        const result = await client.query('SELECT NOW() AS now');
        console.log('✅ PostgreSQL connected directly!');
        console.log('✅ Query successful:', result.rows[0]);
    } finally {
        await client.end();
    }
}

main().catch(err => {
    console.error('❌ Connection error:', err.message);
    process.exit(1);
});
