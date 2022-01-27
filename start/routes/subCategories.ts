import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/', 'subCategoriesController.index').middleware('auth')
  Route.get('/mine', 'subCategoriesController.mysubCategories').middleware('auth')
  Route.get('/:id', 'subCategoriesController.get').middleware('auth')
  Route.delete('/:id', 'subCategoriesController.delete').middleware('auth')
  Route.post('/store', 'subCategoriesController.store').middleware('auth')
  Route.patch('/:id', 'subCategoriesController.update').middleware('auth')
}).prefix('/api/v1/subCategories')
