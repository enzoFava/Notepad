export async function up(knex) {
    return knex.schema.createTable('users', (table) => {
      table.increments('id').primary();
      table.string('firstName').notNullable();
      table.string('lastName').notNullable();
      table.string('email').unique().notNullable();
      table.string('password').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
    .createTable('notes', (table) => {
      table.increments('id').primary();
      table.string('title').notNullable();
      table.text('content');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      table.integer('user_id').references('id').inTable('users');
    })
  }
  
  export async function down(knex) {
    return knex.schema.dropTableIfExists('notes').dropTableIfExists('users');
  }
  