import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone: false,
})
export class AdminPage implements OnInit {

  constructor(private authService : AuthService) { }

  ngOnInit() {
  }

  logout() {
    this.authService.logout();
  }

}
