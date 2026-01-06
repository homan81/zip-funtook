// Script to verify products table has category_id and subcategory_id columns
require('dotenv').config();
const mysql = require('mysql2/promise');

async function checkSchema() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    console.log('Checking products table schema...\n');

    // Get all columns
    const [columns] = await connection.execute(
      `SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT, COLUMN_KEY
       FROM information_schema.COLUMNS 
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'products'
       ORDER BY ORDINAL_POSITION`,
      [process.env.DB_NAME]
    );

    console.log('Products table columns:');
    console.log('═══════════════════════════════════════════════════════');
    columns.forEach(col => {
      const key = col.COLUMN_KEY ? ` [${col.COLUMN_KEY}]` : '';
      console.log(`  ${col.COLUMN_NAME.padEnd(30)} ${col.DATA_TYPE.padEnd(15)} ${col.IS_NULLABLE}${key}`);
    });
    console.log('═══════════════════════════════════════════════════════\n');

    // Check specifically for category_id and subcategory_id
    const hasCategory = columns.some(col => col.COLUMN_NAME === 'category_id');
    const hasSubcategory = columns.some(col => col.COLUMN_NAME === 'subcategory_id');

    console.log('Status:');
    console.log(`  ✓ category_id column: ${hasCategory ? '✅ EXISTS' : '❌ MISSING'}`);
    console.log(`  ✓ subcategory_id column: ${hasSubcategory ? '✅ EXISTS' : '❌ MISSING'}`);

    if (!hasCategory || !hasSubcategory) {
      console.log('\n⚠️  WARNING: Required columns are missing!');
      console.log('   Run the migration script: database/add_category_subcategory_ids.sql');
    } else {
      console.log('\n✅ All required columns exist!');
    }

    // Check for indexes
    const [indexes] = await connection.execute(
      `SHOW INDEX FROM products WHERE Column_name IN ('category_id', 'subcategory_id')`
    );

    if (indexes.length > 0) {
      console.log('\nIndexes:');
      indexes.forEach(idx => {
        console.log(`  • ${idx.Key_name} on ${idx.Column_name}`);
      });
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await connection.end();
  }
}

checkSchema();
