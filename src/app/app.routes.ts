import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/product-list/product-list.component').then(m => m.ProductListComponent),
    title: 'Productos - Banco'
  },
  {
    path: 'product',
    loadComponent: () => import('./features/product-form/product-form.component').then(m => m.ProductFormComponent),
    title: 'Agregar nuevo producto - Banco'
  },
  {
    path: 'product/:id',
    loadComponent: () => import('./features/product-form/product-form.component').then(m => m.ProductFormComponent),
    title: 'Editar producto - Banco'
  }
];
