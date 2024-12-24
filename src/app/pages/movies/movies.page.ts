import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Movie } from 'src/app/models/movie.model';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.page.html',
  styleUrls: ['./movies.page.scss'],
  standalone: false
})
export class MoviesPage implements OnInit {
  movies: Movie[] = [];
  isLoading = true;

  constructor(private movieService: MovieService, private alertController: AlertController) {}

  ngOnInit() {
    this.loadMovies();
  }

  async loadMovies() {
    try {
      this.isLoading = true;
      const fetchedMovies = await this.movieService.fetchAllMovies();
      this.movies = fetchedMovies || [];
    } catch (error) {
      console.error('Error loading movies:', error);
      this.movies = []; 
    } finally {
      this.isLoading = false;
    }
  }

  async showAddMovieAlert() {
    const alert = await this.alertController.create({
      header: 'Add Movie',
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: 'Movie Title',
        },
        {
          name: 'original_title',
          type: 'text',
          placeholder: 'Original Title',
        },
        {
          name: 'original_language',
          type: 'text',
          placeholder: 'Original Language',
        },
        {name: 'overview',
          type: 'text',
          placeholder: 'Overview',
        },
        {
          name: 'release_date',
          type: 'date',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'destructive',
          cssClass: 'secondary',
        },
        {
          text: 'Add',
          handler: (data: Movie) => {
            if (data.title && data.original_title && data.original_language && data.overview && data.release_date) {
              this.movieService.addMovie(data);
              this.loadMovies();
              return true;
            } else {
              alert.message = 'Please fill in all fields!';
              return false;
            }
          },
        },
      ],
    });

    await alert.present();
  }

  async deleteMovie(movie: Movie) {
    const alert = await this.alertController.create({
      header: 'Delete Movie',
      message: `Are you sure you want to delete ${movie.title}?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.movieService.deleteMovie(movie);
            this.loadMovies();
          },
        },
      ],
    }
  );
  await alert.present();
  }
}
