import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Product from './Product'
import Category from './Category'

export default class SubCategory extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public status: boolean

  @column()
  public product_category_id: number

  @belongsTo(() => Category)
  public category: BelongsTo<typeof Category>

  @hasMany(() => Product)
  public products: HasMany<typeof Product>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
