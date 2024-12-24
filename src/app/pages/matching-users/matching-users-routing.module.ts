import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MatchingUsersPage } from './matching-users.page';

const routes: Routes = [
  {
    path: '',
    component: MatchingUsersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MatchingUsersPageRoutingModule {}
