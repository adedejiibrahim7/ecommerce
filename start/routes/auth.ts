import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/signup', 'UsersController.signup')
  Route.post('/login', 'UsersController.login')
  Route.post('/logout', 'UsersController.logout')
}).prefix('/api/v1/auth')
