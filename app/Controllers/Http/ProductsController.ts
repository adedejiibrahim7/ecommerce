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
                product_category_id: schema.number([rules.unsigned()]),
                product_sub_category_id: schema.number([rules.unsigned()]),
                
            })
        })

        try{
            const product = Product.create(data)

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

    public async  index({request, response, auth}: HttpContextContract){
        try{
            const products = Product.all()

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

    public async myProducts({request, response, auth}: HttpContextContract){
        try{
            const products = Product.findBy('user_id', auth.user!.id)
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

    public async get({response, auth, params}: HttpContextContract){
        const id = params.id

        try{
            const product = Product.find(id)

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

    public async delete({ response, auth, params }: HttpContextContract){
        const id = params.id

        try{
            const product = Product.find(id)

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

    public async update({request, response, auth, params}: HttpContextContract){
        const data = await request.validate({
            schema: schema.create({
                title: schema.string().optional({ trim: true }, [rules.minLength(2)]),
                desctiption: schema.string().optional({ trim: true }, [rules.minLength(2)]),
                price: schema.number().optional([rules.unsigned()]),
                product_category_id: schema.number().optional([rules.unsigned()]),
                product_sub_category_id: schema.number().optional([rules.unsigned()]),

            })
        })

        try{
            const id = params.id

            const product = Product.findOrFail(id)
    
            await product.merge(data).save()
    
            return response.json({
                status: "success",
                message: "Product details updated",
                data: product
            })
        }catch (error) {
            return response.status(500).json({
              status: 'failure',
              data: error,
            })
          }

    }
}
