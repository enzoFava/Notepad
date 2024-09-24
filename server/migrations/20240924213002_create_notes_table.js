export async function up(knex) {
    return knex.schema.createTable('notes', (table) => {
      table.increments('id').primary();
      table.string('title').notNullable();
      table.text('content');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
  }
  
  export async function down(knex) {
    return knex.schema.dropTableIfExists('notes');
  }
  