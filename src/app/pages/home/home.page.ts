import { Component, OnInit } from '@angular/core';
import { Movie } from 'src/app/models/movie.model';
import { AuthService } from 'src/app/services/auth.service';
import { MovieService } from 'src/app/services/movie.service';
import { InfiniteScrollCustomEvent } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  movies: Movie[] = [];
  userFavorites: string[] = [];
  currentPage = 1;

  constructor(
    private movieService: MovieService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadMovies();
    //this.movieService.initializeMoviesCollection();
    this.loadUserFavorites();
  }

  async loadMovies() {
    try {
      const newMovies = await this.movieService.fetchAllMovies();
      this.movies = this.currentPage === 1 ? newMovies : [...this.movies, ...newMovies];
    } catch (error) {
      console.error('Error loading movies:', error);
    }
  }

  async loadMore(event: InfiniteScrollCustomEvent) {
    this.currentPage++;
    await this.loadMovies();
    event.target.complete();
  }

  async loadUserFavorites() {
    try {
      const favoritesResponse = await this.movieService.getUserFavorites();
      this.userFavorites = favoritesResponse.favoriteMovies;
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  }

  async addToFavorites(movie: Movie) {
    try {
      await this.movieService.addToFavorites(movie);
      await this.loadUserFavorites(); // Refresh favorites list
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  }

  logout() {
    this.authService.logout();
  }
}