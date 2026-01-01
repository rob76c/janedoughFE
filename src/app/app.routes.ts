import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '', 
        pathMatch: 'full',
        redirectTo: 'products/all'
    },
    {
    path: 'products/:category',
    loadComponent: () => import('@/src/app/shell/layout/web-page/products-grid/products-grid'),
},

    {
    path: 'wishlist',
    loadComponent: () => import('@/src/app/shell/layout/web-page/wishlist/wishlist'),
},
{
    path:'cart',
    loadComponent: () => import('@/src/app/shell/layout/web-page/shopping-cart/shopping-cart'),
},
{
    path:'checkout',
    loadComponent: () => import('@/src/app/shell/layout/web-page/checkout/checkout'),
},
{
    path:'order-success',
    loadComponent: () => import('@/src/app/shell/layout/web-page/order-success/order-success'),
}
];
