import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Category from 'App/Models/Category'
import { schema, rules } from '@ioc:Adonis/Core/Validator'


export default class CategoriesController {
       //Get all categories that exist

       public async  index({request, response, auth}: HttpContextContract){
        try{
            const categories = await Category.all()

            return response.json({
                status: "success",
                data: categories
            })

        }catch(e){
            return response.status(500).json({
                status: "failure",
                message: "An error occurred",
                error: e
            })
        }
    }

    //Get categories created by authenticated user
    public async myCategories({request, response, auth}: HttpContextContract){
        try{
            const categories = await Category.findBy('user_id', auth.user!.id)
            if(!categories){
                return response.status(404).json({
                    status: "failure",
                    message: "Authenticated user has no categories"
                })
            }

            return response.json({
                status: "success",
                data: categories
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
            const category = await Category.find(id)

            if(!category){
                return response.status(404).json({
                    status: "failure",
                    message: "category with specified id does not exist"
                })
            }

            return response.json({
                status: "success",
                data: category
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
            const category = await Category.find(id)

            if(!category){
                return response.status(404).json({
                    status: "failure",
                    message: "Category with specified id does not exist"
                })
            }

            await category.delete()

            return response.json({
                status: "success",
                message: "Category deleted"
            })
        }catch(e){
            return response.status(500).json({
                status: "failure",
                message: "An error occurred",
                error: e
            })
        }
    }

    public async store({request, response, auth}: HttpContextContract){
        
        const data = await request.validate({
            schema: schema.create({
                name: schema.string({ trim: true }, [rules.minLength(2)]),
                status: schema.boolean.optional()
            })
        })

        try{
            const category = await Category.create(data)

            return response.status(201).json({
                status: "success",
                message: "Category created",
                data: category
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
                name: schema.string.optional({ trim: true }, [rules.minLength(2)]),
                status: schema.boolean.optional()
            })
        })

        try{
            const id = params.id

            const category = await Category.findOrFail(id)
    
            category.name = data.name || category.name
            category.status = data.status || category.status

            category.save()
    
            return response.json({
                status: "success",
                message: "Category details updated",
                data: category
            })
        }catch (error) {
            return response.status(500).json({
              status: 'failure',
              data: error,
            })
          }

    }

}
