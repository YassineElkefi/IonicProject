import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { Movie } from 'src/app/models/movie.model';
import { AuthService } from 'src/app/services/auth.service';
import { MovieService } from 'src/app/services/movie.service';
import { User } from 'src/app/models/user.model';
import { doc, Firestore, updateDoc, arrayRemove } from '@angular/fire/firestore';

@Component({
  selector: 'app-my-favorites',
  templateUrl: './my-favorites.page.html',
  styleUrls: ['./my-favorites.page.scss'],
  standalone: false
})
export class MyFavoritesPage implements OnInit {
  favoriteMovies: Movie[] = [];
  isLoading = true;
  error: string | null = null;
  currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private movieService: MovieService,
    private storage: Storage,
    private firestore: Firestore
  ) {}

  async ngOnInit() {
    try {
      await this.loadUserAndFavorites();
    } catch (error) {
      console.error('Error in ngOnInit:', error);
      this.error = 'Failed to initialize page';
    }
  }

  private async loadUserAndFavorites() {
    this.currentUser = await this.storage.get('user');
    console.log('Retrieved user from storage:', this.currentUser);

    if (!this.currentUser) {
      console.log('No user found in storage');
      this.error = 'Please log in again';
      this.isLoading = false;
      return;
    }

    if (!this.currentUser.id) {
      console.log('User found but no UID:', this.currentUser);
      this.error = 'Invalid user data';
      this.isLoading = false;
      return;
    }

    console.log('Attempting to fetch favorites for user:', this.currentUser.id);

    try {
      const userData = await this.movieService.getFavoriteMovies(this.currentUser.id);
      console.log('Retrieved user data:', userData);

      if (!userData?.favoriteMovies) {
        console.log('No favorite movies found');
        this.favoriteMovies = [];
        this.isLoading = false;
        return;
      }

      const allMovies = await this.movieService.fetchAllMovies();
      console.log('All movies retrieved:', allMovies?.length || 0);

      this.favoriteMovies = allMovies.filter(movie => 
        movie?.id && userData.favoriteMovies.includes(movie.id)
      );

      console.log('Filtered favorite movies:', this.favoriteMovies);

    } catch (error) {
      console.error('Error loading favorites:', error);
      this.error = 'Failed to load favorite movies';
    } finally {
      this.isLoading = false;
    }
  }

  async removeFromFavorites(movie: Movie) {
    if (!this.currentUser?.id || !movie?.id) {
      console.error('Missing user ID or movie ID');
      return;
    }

    try {
      console.log('Removing movie:', movie.id, 'for user:', this.currentUser.id);
      
      const userRef = doc(this.firestore, 'users', this.currentUser.id);
      await updateDoc(userRef, {
        favoriteMovies: arrayRemove(movie.id)
      });

      this.favoriteMovies = this.favoriteMovies.filter(m => m.id !== movie.id);
      console.log('Movie removed successfully');

    } catch (error) {
      console.error('Error removing movie from favorites:', error);
    }
  }
  retryLoading() {
    this.isLoading = true;
    this.error = null;
    this.loadUserAndFavorites();
  }
}