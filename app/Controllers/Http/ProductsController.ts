// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Product from 'App/Models/Product'
export default class ProductsController {

    public async  store({request, response, auth}: HttpContextContract){
        const data = await request.validate({
            schema: schema.create({
                title: schema.string({ trim: true }, [rules.minLength(2)]),
                description: schema.string({ trim: true }, [rules.minLength(2)]),
                price: schema.number([rules.unsigned()]),
                product_category_id: schema.number([rules.unsigned(), rules.exists({table: 'categories', column: 'id'})]),
                product_sub_category_id: schema.number([rules.unsigned(), rules.exists({table: 'sub_categories', column: 'id'})]),

            })
        })



        try{
            const product = await Product.create({
                title: data.title,
                description: data.description,
                price: data.price,
                product_category_id: data.product_category_id,
                product_sub_category_id: data.product_sub_category_id,
                user_id: auth.user?.id
            })

            return response.status(201).json({
                status: "success",
                message: "Product created",
                data: product
            })
        }catch(e){
            return response.status(500).json({
                status: "failure",
                message: "An error occurred",
                error: e
            })
        }

    }

    //GEt all products that exist

    public async  index({ response}: HttpContextContract){
        try{
            const products = await Product.all()

            return response.json({
                status: "success",
                data: products
            })

        }catch(e){
            return response.status(500).json({
                status: "failure",
                message: "An error occurred",
                error: e
            })
        }
    }

    //Get my products (authenticated user (admin))

    public async myProducts({ response, auth}: HttpContextContract){
        try{
            const products = await Product.findBy('user_id', auth.user?.id)
            // console.log(products)
            if(!products){
                return response.status(404).json({
                    status: "failure",
                    message: "Authenticated user has no products"
                })
            }

            return response.json({
                status: "success",
                data: products
            })

        }catch(e){
            return response.status(500).json({
                status: "failure",
                message: "An error occurred",
                error: e
            })
        }
    }

    public async get({response, params}: HttpContextContract){
        const id = params.id

        try{
            const product = await Product.find(id)

            if(!product){
                return response.status(404).json({
                    status: "failure",
                    message: "Product with specified id does not exist"
                })
            }

            return response.json({
                status: "success",
                data: product
            })
        }catch(e){
            return response.status(500).json({
                status: "failure",
                message: "An error occurred",
                error: e
            })
        }
    }

    public async delete({ response, params }: HttpContextContract){
        const id = params.id

        try{
            const product = await Product.find(id)

            if(!product){
                return response.status(404).json({
                    status: "failure",
                    message: "Product with specified id does not exist"
                })
            }

            await product.delete()

            return response.json({
                status: "success",
                message: "Product deleted"
            })
        }catch(e){
            return response.status(500).json({
                status: "failure",
                message: "An error occurred",
                error: e
            })
        }
    }

    public async update({request, response, params}: HttpContextContract){
        const data = await request.validate({
            schema: schema.create({
                title: schema.string.optional({ trim: true }, [rules.minLength(2)]),
                description: schema.string.optional({ trim: true }, [rules.minLength(2)]),
                price: schema.number.optional([rules.unsigned()]),
                product_category_id: schema.number.optional([rules.unsigned(), rules.exists({table: 'categories', column: 'id'})]),
                product_sub_category_id: schema.number.optional([rules.unsigned(), rules.exists({table: 'sub_categories', column: 'id'})]),

            })
        })

        try{
            const id = params.id

            const product = await Product.findBy('id',id)

            if(!product){
                return response.status(404).json({
                    status: "failure",
                    message: "Invalid product id"
                })
            }
            ;(await product).title = data.title || (await product).title
            ;(await product).description = data.description || (await product).description
            ;(await product).price = data.price || (await product).price
            ;(await product).product_category_id = data.product_category_id || (await product).product_category_id
            ;(await product).product_sub_category_id = data.product_sub_category_id || (await product).product_sub_category_id

            ;(await product).save()


            return response.json({
                status: "success",
                message: "Product details updated",
                data: product
            })
        }catch (error) {
            return response.status(500).json({
              status: 'failure',
              error: error,
            })
          }

    }
}
