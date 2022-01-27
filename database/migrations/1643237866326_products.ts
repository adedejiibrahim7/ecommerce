import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Products extends BaseSchema {
  protected tableName = 'products'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id', 25).unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('product_category_id', 25).unsigned().references('id').inTable('categories').onDelete('CASCADE')
      table.integer('product_sub_category_id', 25).unsigned().references('id').inTable('sub_categories').onDelete('CASCADE')
      table.string('title').notNullable();
      table.text('description').notNullable(); //Product descriptions can be long. not advisable to use string(varvhar)
      table.integer('price').notNullable();
      // table.timestamps(true)
      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
