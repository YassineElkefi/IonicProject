import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { arrayUnion, collection, deleteDoc, doc, Firestore, getDoc, getDocs, query, setDoc, updateDoc, where, writeBatch } from '@angular/fire/firestore';
import { DocumentData } from '@firebase/firestore';
import { Observable } from 'rxjs';
import { Movie } from '../models/movie.model';

interface UserMatch {
  user: DocumentData;
  matchRate: number;
}
interface MovieResponse {
  results: Movie[];
}


@Injectable({
  providedIn: 'root'
})
export class MovieService{
  private apiKey = '13dce0ba9576b28e334787e7785fa776';
  private baseUrl = 'https://api.themoviedb.org/3';
  constructor(private http:HttpClient,private auth: Auth, private firestore: Firestore) { }
  
  getPopularMovies(): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(
      `${this.baseUrl}/movie/popular?api_key=${this.apiKey}&language=fr-FR`
    );
  }

  async initializeMoviesCollection() {
    const moviesRef = collection(this.firestore, 'movies');
    const snapshot = await getDocs(moviesRef);
  
    if (!snapshot.empty) {
      console.log('Movies collection is already populated.');
      return;
    }
  
    const popularMovies = await this.getPopularMovies().toPromise();
    if (!popularMovies?.results) {
      console.error('No movies fetched from the API.');
      return;
    }
  
    const batch = writeBatch(this.firestore);
  
    popularMovies.results.forEach(movie => {
      const movieData = {
        id: '', 
        title: movie.title,
        adult: movie.adult,
        original_language: movie.original_language,
        original_title: movie.original_title,
        overview: movie.overview,
        release_date: movie.release_date,
      };
  
      const newMovieRef = doc(moviesRef); 
  
      movieData.id = newMovieRef.id;
  
      batch.set(newMovieRef, movieData); 
    });
  
    try {
      await batch.commit();
      console.log('Movies collection initialized successfully.');
    } catch (error) {
      console.error('Error initializing movies collection:', error);
    }
  }

  async addToFavorites(movie: Movie) {
    const userId = this.auth.currentUser?.uid;
    if (!userId) return;
  
    const userRef = doc(this.firestore, 'users', userId);
  
    const movieDocId = movie.id;
  
    if (typeof movieDocId !== 'string') {
      console.error('Invalid movie document ID');
      return;
    }
  
    try {
      await updateDoc(userRef, {
        favoriteMovies: arrayUnion(movieDocId)
      });
      console.log('Movie added to favorites successfully');
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  }
  

  async findMatches(userId: string) {
    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('isActive', '==', true));
    const snapshot = await getDocs(q);
    const currentUserDoc = await getDoc(doc(this.firestore, 'users', userId));
    const currentUser = currentUserDoc.data();
    
    return snapshot.docs
      .filter(doc => doc.id !== userId)
      .map(doc => {
        const userData = doc.data();
        const matchRate = this.calculateMatchRate(
          currentUser?.['favoriteMovies'] || [],
          userData['favoriteMovies'] || []
        );
        return { user: userData, matchRate } as UserMatch;
      })
      .filter(match => match.matchRate >= 75);
  }

  private calculateMatchRate(list1: string[], list2: string[]): number {
    const intersection = list1.filter(id => list2.includes(id));
    const union = [...new Set([...list1, ...list2])];
    return union.length === 0 ? 0 : (intersection.length / union.length) * 100;
  }

  async fetchAllMovies() {
    const moviesRef = collection(this.firestore, 'movies');
    const snapshot = await getDocs(moviesRef);
    return snapshot.docs.map(doc => doc.data() as Movie);
  }
  async addMovie(data: Movie) {
    const moviesRef = collection(this.firestore, 'movies');
    const newMovieRef = doc(moviesRef);  
  
    const movieDataWithId = {
      ...data,    
      id: newMovieRef.id
    };
  

    await setDoc(newMovieRef, movieDataWithId);
    console.log('Movie added with ID:', newMovieRef.id);
  }
  async deleteMovie(movie: Movie) {
    if (!movie?.id) {
      console.error('Movie ID is undefined.');
      return;
    }
  
    const moviesRef = collection(this.firestore, 'movies');
    const q = query(moviesRef, where('id', '==', movie.id));
    const querySnapshot = await getDocs(q);
  
    if (querySnapshot.empty) {
      console.error('Movie not found in Firestore.');
      return;
    }
  
    const docToDelete = querySnapshot.docs[0];
    try {
      await deleteDoc(doc(this.firestore, 'movies', docToDelete.id));
      console.log(`Movie with ID ${movie.id} deleted successfully.`);
    } catch (error) {
      console.error('Error deleting movie:', error);
    }
  }
  async getFavoriteMovies(userId: string) {
    console.log('getFavoriteMovies called with userId:', userId);
    
    try {
      if (!userId || typeof userId !== 'string') {
        console.error('Invalid userId provided:', userId);
        throw new Error('User ID is required');
      }
      
      const userRef = doc(this.firestore, 'users', userId);
      console.log('Fetching doc for user:', userId);
      
      const userDoc = await getDoc(userRef);
      console.log('User doc exists:', userDoc.exists());
      
      if (!userDoc.exists()) {
        console.log('No user document found');
        return { favoriteMovies: [] };
      }
      
      const userData = userDoc.data();
      console.log('User data retrieved:', userData);
      
      const favoriteMovies = userData?.['favoriteMovies'] || [];
      console.log('Favorite movies array:', favoriteMovies);
      
      return {
        favoriteMovies: Array.isArray(favoriteMovies) ? favoriteMovies : []
      };
    } catch (error) {
      console.error('Error in getFavoriteMovies:', error);
      return { favoriteMovies: [] };
    }
  }
  getUserFavorites() {
    return this.auth.currentUser?.uid
      ? this.getFavoriteMovies(this.auth.currentUser.uid)
      : Promise.resolve({ favoriteMovies: [] });
  }
}