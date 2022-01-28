// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'
// import Hash from '@ioc:Adonis/Core/Hash'




export default class UsersController {

    public async signup({request, response, auth}: HttpContextContract){


        const data = await request.validate({
           schema: schema.create({
            first_name: schema.string({ trim: true }, [rules.minLength(2)]),
            last_name: schema.string({ trim: true }, [ rules.minLength(2)]),
            email: schema.string({ trim: true }, [rules.email(), rules.regex(/^\S+@\S+\.\S+$/)]),
            password: schema.string({ trim: true }, [rules.minLength(8), rules.confirmed()]),
            contact_number: schema.string({ trim: true }, [rules.mobile()]),
            gender: schema.string({ trim: true }),
            address: schema.string({ trim: true }),

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


            // if(data.password != data.confirmPassword){
            //     return response.status(400).json({
            //         status: "failure",
            //         "message": "Passwords do not match"
            //     })
            // }

            const user = await User.create({
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email,
                password: data.password,
                gender: data.gender,
                contact_number: data.contact_number,

            });

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
            console.log(e)
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
          await auth.use('api').logout()
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

    public async update({request, response, params}: HttpContextContract){
        const data = await request.validate({
            schema: schema.create({
                first_name: schema.string.optional({ trim: true }, [rules.minLength(2)]),
                last_name: schema.string.optional({ trim: true }, [rules.minLength(2)]),
                contact_number: schema.string.optional({ trim: true }, [rules.minLength(10)]),
                address: schema.string.optional({ trim: true }, [rules.minLength(2)]),
            })
        })

        try{
            const id = params.id

            const user = await User.findOrFail(id)

            // await user.merge(data).save()
            ;(await user).first_name = data.first_name || (await user).first_name
            ;(await user).last_name = data.last_name || (await user).last_name
            ;(await user).contact_number = data.contact_number || (await user).contact_number
            ;(await user).address = data.address || (await user).address

            ;(await user).save()


            console.log(user)

            return response.json({
                status: "success",
                message: "User details updated",
            })
        }catch (error) {
            return response.status(500).json({
              status: 'failure',
              data: error,
            })
          }

    }
}
