import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-matching-users',
  templateUrl: './matching-users.page.html',
  styleUrls: ['./matching-users.page.scss'],
  standalone: false
})
export class MatchingUsersPage implements OnInit {
  matchingUsers: any[] = [];
  isLoading: boolean = true;

  constructor(private movieService: MovieService, private auth: Auth) {}

  ngOnInit() {
    this.loadMatchingUsers();
  }

  async loadMatchingUsers() {
    try {
      const userId = this.auth.currentUser?.uid;
      if (userId) {
        this.matchingUsers = await this.movieService.findMatches(userId);
      }
      this.isLoading = false;
    } catch (error) {
      console.error('Error loading matching users:', error);
      this.isLoading = false;
    }
  }

  getMatchColor(matchRate: number): string {
    if (matchRate >= 80) return 'success';
    if (matchRate >= 60) return 'primary';
    if (matchRate >= 40) return 'warning';
    return 'medium';
  }

  getMatchLabel(matchRate: number): string {
    if (matchRate >= 80) return 'Excellent Match';
    if (matchRate >= 60) return 'Good Match';
    if (matchRate >= 40) return 'Fair Match';
    return 'Low Match';
  }
}