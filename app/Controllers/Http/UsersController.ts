// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'



export default class UsersController {

    public async signup({request, response, auth}: HttpContextContract){


        const data = await request.validate({
           schema: schema.create({
            first_name: schema.string({ trim: true }, [rules.minLength(2)]),
            last_name: schema.string({ trim: true }, [ rules.minLength(2)]),
            email: schema.string({ trim: true }, [rules.email(), rules.regex(/^\S+@\S+\.\S+$/)]),
            password: schema.string({ trim: true }, [rules.minLength(8)]),
            confirmPassword: schema.string({ trim: true }, [rules.minLength(8)]),
            contact_number: schema.string({ trim: true }, [rules.mobile()]),
            gender: schema.string({ trim: true }),

           })
        })

        try{
            const checkIfEmailExists = await User.findBy('email', data.email)

            if(checkIfEmailExists){
                return response.status(400).json({
                    status: "failure",
                    "message": "Email already exists"
                })
            }

            if(data.password != data.confirmPassword){
                return response.status(400).json({
                    status: "failure",
                    "message": "Passwords do not match"
                })
            }

            const user = await User.create(data);

            const token = await auth.use('api').login(user, {
                expiresIn: '10 days',
              })

            return response.status(201).json({
                status: "success",
                message: "Signup successful",
                token: token
            })


        }catch(e){
            return response.status(500).json({
                status: "failure",
                message: "An error occurred",
                error: e
            })
        }
    }

    public async login({request, response, auth}: HttpContextContract){
        const data = await request.validate({
            schema: schema.create({
                email: schema.string({}, [rules.email()]),
                password: schema.string({}, [rules.minLength(8)]),
            })
        })

        try {
            const token = await auth.use('api').attempt(data.email, data.password, {
              expiresIn: '10 days',
            })
      
            return response.json( {
              status: 'Success',
              data: token,
            })
          } catch (error) {
            return response.status(500).json({
              status: 'failure',
              message: "An error occurred",
              error: error,
            })
          }
    }

    public async logout({ auth, response }: HttpContextContract) {
        try {
          await auth.use('api').revoke()
          return response.json({
            status: "success",
            message: 'Successfully logged out',
          })
        } catch (error) {
          return response.status(500).json({
            status: 'failure',
            data: error,
          })
        }
    }

    public async update({request, response, auth, params}: HttpContextContract){
        const data = await request.validate({
            schema: schema.create({
                first_name: schema.string().optional({ trim: true }, [rules.minLength(2)]),
                last_name: schema.string().optional({ trim: true }, [rules.minLength(2)]),
                contact_number: schema.string().optional({ trim: true }, [rules.minLength(10)]),
                address: schema.string().optional({ trim: true }, [rules.minLength(2)]),
            })
        })

        try{
            const id = params.id

            const user = User.findOrFail(id)
    
            await user.merge(data).save()
    
            return response.json({
                status: "success",
                message: "User details updated",
                data: user
            })
        }catch (error) {
            return response.status(500).json({
              status: 'failure',
              data: error,
            })
          }

    }
}
