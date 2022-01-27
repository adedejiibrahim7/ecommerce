import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.patch('/:id', 'UsersController.update').middleware('auth')
}).prefix('/api/v1/user')
