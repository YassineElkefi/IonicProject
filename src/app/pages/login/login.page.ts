import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage {
  loginForm: FormGroup;
  showPassword = false;

  validation_messages = {
    email: [
      { type: 'required', message: 'Email est requis' },
      { type: 'email', message: 'Entrez un email valide' }
    ],
    password: [
      { type: 'required', message: 'Mot de passe est requis' },
      { type: 'minlength', message: 'Le mot de passe doit contenir au moins 6 caractères' }
    ]
  };

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      const loading = await this.loadingCtrl.create({
        message: 'Connexion en cours...',
        spinner: 'circular'
      });
      await loading.present();

      try {
        await this.authService.login(
          this.loginForm.get('email')?.value,
          this.loginForm.get('password')?.value
        );
        this.loginForm.reset();
        loading.dismiss();
      } catch (error: any) {
        loading.dismiss();
        const toast = await this.toastCtrl.create({
          message: this.getErrorMessage(error),
          duration: 3000,
          position: 'bottom',
          color: 'danger'
        });
        toast.present();
      }
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  private getErrorMessage(error: any): string {
    if (error.message === 'Your account is disabled. Please contact support.') {
      return 'Votre compte est désactivé. Veuillez contacter le support.';
    }
    if (error.code === 'auth/user-not-found') {
      return 'Aucun utilisateur trouvé avec cet email.';
    }
    if (error.code === 'auth/wrong-password') {
      return 'Mot de passe incorrect.';
    }
    return 'Une erreur est survenue. Veuillez réessayer.';
  }
}