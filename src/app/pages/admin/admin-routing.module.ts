import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminPage } from './admin.page';
import { adminGuard } from 'src/app/admin.guard';

const routes: Routes = [
  {
    path: '',
    component: AdminPage
  },
  {
      path: 'movies',
      loadChildren: () => import('../movies/movies.module').then( m => m.MoviesPageModule),
      canActivate: [adminGuard]
    },
    {
      path: 'users',
      loadChildren: () => import('../users/users.module').then( m => m.UsersPageModule),
      canActivate: [adminGuard]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPageRoutingModule {}
