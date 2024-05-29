/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.createTable('blocks', tb => {
    tb.increments('id')
    tb.timestamps(false, true, true)
    tb.string('type')
    tb.string('key')
    tb.string('name')
    tb.text('body')
    tb.json('props')
    tb.json('refs')

    tb.index('key')
    tb.index('name')
    tb.index('type')
  })

};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTable('blocks')
};
