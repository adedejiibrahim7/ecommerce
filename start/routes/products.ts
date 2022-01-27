import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/', 'ProductsController.index').middleware('auth')
  Route.get('/mine', 'ProductsController.myProducts').middleware('auth')
  Route.get('/:id', 'ProductsController.get').middleware('auth')
  Route.delete('/:id', 'ProductsController.delete').middleware('auth')
  Route.post('/store', 'ProductsController.store').middleware('auth')
  Route.patch('/:id', 'ProductsController.update').middleware('auth')
}).prefix('/api/v1/products')
