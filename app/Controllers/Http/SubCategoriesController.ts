import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import SubCategory from 'App/Models/SubCategory'



export default class SubCategoriesController {

           //Get all subCategories that exist

           public async  index({request, response, auth}: HttpContextContract){
            try{
                const subCategory = SubCategory.all()
    
                return response.json({
                    status: "success",
                    data: subCategory
                })
    
            }catch(e){
                return response.status(500).json({
                    status: "failure",
                    message: "An error occurred",
                    error: e
                })
            }
        }
    
        //Get subCategory created by authenticated user
        public async mySubCategories({request, response, auth}: HttpContextContract){
            try{
                const subCategories = SubCategory.findBy('user_id', auth.user!.id)
                if(!subCategories){
                    return response.status(404).json({
                        status: "failure",
                        message: "Authenticated user has no categories"
                    })
                }
    
                return response.json({
                    status: "success",
                    data: subCategories
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
                const subCategory = SubCategory.find(id)
    
                if(!subCategory){
                    return response.status(404).json({
                        status: "failure",
                        message: "subCategory with specified id does not exist"
                    })
                }
    
                return response.json({
                    status: "success",
                    data: subCategory
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
                const subCategory = SubCategory.find(id)
    
                if(!subCategory){
                    return response.status(404).json({
                        status: "failure",
                        message: "Category with specified id does not exist"
                    })
                }
    
                await subCategory.delete()
    
                return response.json({
                    status: "success",
                    message: "subCategory deleted"
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
                    status: schema.boolean.optional(),
                    product_category_id: schema.number([rules.unsigned()])
                })
            })
    
            try{
                const subCategory = SubCategory.create(data)
    
                return response.status(201).json({
                    status: "success",
                    message: "subCategory created",
                    data: subCategory
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
                    name: schema.string().optional({ trim: true }, [rules.minLength(2)]),
                    status: schema.boolean.optional(),
                    product_sub_category_id: schema.number.optional([rules.unsigned])
                })
            })
    
            try{
                const id = params.id
    
                const subCategory = SubCategory.findOrFail(id)
        
                await subCategory.merge(data).save()
        
                return response.json({
                    status: "success",
                    message: "SubCategory details updated",
                    data: subCategory
                })
            }catch (error) {
                return response.status(500).json({
                  status: 'failure',
                  data: error,
                })
              }
    
        }
}
