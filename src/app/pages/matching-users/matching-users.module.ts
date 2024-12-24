import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MatchingUsersPageRoutingModule } from './matching-users-routing.module';

import { MatchingUsersPage } from './matching-users.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatchingUsersPageRoutingModule
  ],
  declarations: [MatchingUsersPage]
})
export class MatchingUsersPageModule {}
