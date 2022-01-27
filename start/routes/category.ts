import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/', 'CategoriesController.index').middleware('auth')
  Route.get('/mine', 'CategoriesController.myCategories').middleware('auth')
  Route.get('/:id', 'CategoriesController.get').middleware('auth')
  Route.delete('/:id', 'CategoriesController.delete').middleware('auth')
  Route.post('/store', 'CategoriesController.store').middleware('auth')
  Route.patch('/:id', 'CategoriesController.update').middleware('auth')
}).prefix('/api/v1/categories')
