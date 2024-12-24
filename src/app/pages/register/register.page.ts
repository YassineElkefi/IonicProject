import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Camera, CameraResultType } from '@capacitor/camera';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: 'register.page.html',
  styleUrls: ['register.page.scss'],
  standalone: false
})
export class RegisterPage {
  registerForm: FormGroup;
  showPassword = false;
  //photo: string | undefined;

  validation_messages = {
    email: [
      { type: 'required', message: 'Email est requis' },
      { type: 'email', message: 'Entrez un email valide' }
    ],
    password: [
      { type: 'required', message: 'Mot de passe est requis' },
      { type: 'minlength', message: 'Le mot de passe doit contenir au moins 6 caractères' }
    ],
    firstName: [
      { type: 'required', message: 'Prénom est requis' }
    ],
    lastName: [
      { type: 'required', message: 'Nom est requis' }
    ],
    age: [
      { type: 'required', message: 'Age est requis' },
      { type: 'min', message: 'Vous devez avoir au moins 13 ans' }
    ]
  };

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(13)]]
    });
  }

  /*async takePicture() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl
      });
      this.photo = image.dataUrl;
    } catch (error) {
      const toast = await this.toastCtrl.create({
        message: 'Erreur lors de la prise de photo',
        duration: 2000,
        position: 'bottom',
        color: 'danger'
      });
      toast.present();
    }
  }*/

  async onSubmit() {
    if (this.registerForm.valid) {
      const loading = await this.loadingCtrl.create({
        message: 'Création du compte...',
        spinner: 'circular'
      });
      await loading.present();

      try {
        await this.authService.register(
          this.registerForm.get('email')?.value,
          this.registerForm.get('password')?.value,
          {
            firstName: this.registerForm.get('firstName')?.value,
            lastName: this.registerForm.get('lastName')?.value,
            age: this.registerForm.get('age')?.value,
            //photoUrl: this.photo
          }
        );
        loading.dismiss();
        const toast = await this.toastCtrl.create({
          message: 'Compte créé avec succès!',
          duration: 2000,
          position: 'bottom',
          color: 'success'
        });
        toast.present();
        this.router.navigate(['/home']);
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
      this.registerForm.markAllAsTouched();
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  private getErrorMessage(error: any): string {
    if (error.code === 'auth/email-already-in-use') {
      return 'Cet email est déjà utilisé.';
    }
    if (error.code === 'auth/invalid-email') {
      return 'Email invalide.';
    }
    if (error.code === 'auth/operation-not-allowed') {
      return 'Opération non autorisée.';
    }
    if (error.code === 'auth/weak-password') {
      return 'Le mot de passe est trop faible.';
    }
    return 'Une erreur est survenue. Veuillez réessayer.';
  }
}