import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RegisterRoutingModule } from './register-routing.module';
import { RegisterPage } from './register.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [RegisterPage]
})
export class RegisterModule {}
