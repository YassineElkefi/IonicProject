import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
  standalone: false
})
export class UsersPage implements OnInit {

  users: User[] = [];
  isLoading = false;
  error: string | null = null;
  
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loadUsers();
  }

  async loadUsers() {
    try {
      this.isLoading = true;
      this.error = null;
      this.users = await this.authService.fetchUsers();
    } catch (error) {
      this.error = 'Failed to load users';
      console.error('Error loading users:', error);
    } finally {
      this.isLoading = false;
    }
  }

  getAdminCount(): number {
    return this.users.filter(user => user.isAdmin).length;
  }

  async disableUser(user: User) {
    try {
      await this.authService.disableUser(user.id);
      user.isActive = false;
    } catch (error) {
      console.error('Error disabling user:', error);
  }
}
  async enableUser(user: User) {
    try {
      await this.authService.enableUser(user.id);
      user.isActive = true;
    } catch (error) {
      console.error('Error enabling user:', error);
    }
  }
}
