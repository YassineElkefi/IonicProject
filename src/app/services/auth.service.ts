import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword,createUserWithEmailAndPassword } from '@angular/fire/auth';
import { doc, Firestore, setDoc, getDoc, collection, query, getDocs } from '@angular/fire/firestore';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _storage: Storage | null = null;
  private currentUser = new BehaviorSubject<User | null>(null);

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private storage: Storage,
    private router: Router
  ) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
    this.checkAuth();
  }

  private async checkAuth() {
    const userData = await this._storage?.get('user');
    if (userData) {
      this.currentUser.next(userData);
      this.redirectBasedOnRole(userData);
    } else {
      this.router.navigate(['/login']);
    }
  }

  async register(email: string, password: string, userData: Partial<User>) {
    const credential = await createUserWithEmailAndPassword(this.auth, email, password);
    
    const userRef = doc(this.firestore, 'users', credential.user.uid);
    
    const userDoc = {
      ...userData,
      uid: credential.user.uid,
      id: credential.user.uid,
      isActive: true,
      isAdmin: false,
      favoriteMovies: []
    };
  
    await setDoc(userRef, userDoc);
    
    await this._storage?.set('user', userDoc);
    
    this.currentUser.next(userDoc as User);
    
    return credential;
  }

  async login(email: string, password: string) {
    try {
      const credential = await signInWithEmailAndPassword(this.auth, email, password);
      
      const userDoc = await getDoc(doc(this.firestore, 'users', credential.user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        
        if (!userData.isActive) {
          throw new Error('Your account is disabled. Please contact support.');
        }
        
        await this._storage?.set('user', userData);
        this.currentUser.next(userData);
        this.redirectBasedOnRole(userData);
        return credential;
      } else {
        throw new Error('User document does not exist');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async logout() {
    await this.auth.signOut();
    await this._storage?.remove('user');
    this.currentUser.next(null);
    this.router.navigate(['/login']);
  }

  private redirectBasedOnRole(user: User) {
    if (user.isAdmin) {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/home']);
    }
  }

  getCurrentUser() {
    return this.currentUser.asObservable();
  }

  async isLoggedIn() {
    const user = await this._storage?.get('user');
    return user !== null;
  }
  async fetchUsers(): Promise<User[]> {
    try {
      const usersRef = collection(this.firestore, 'users');
      const q = query(usersRef);
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        firstName: doc.data()['firstName'],
        lastName: doc.data()['lastName'],
        age: doc.data()['age'],
        //photoUrl: doc.data()['photoUrl'],
        isActive: doc.data()['isActive'],
        isAdmin: doc.data()['isAdmin'],
        favoriteMovies: doc.data()['favoriteMovies'],
        //email: doc.data()['email']
      }));
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }
  async disableUser(userId: string) {
    try {
      const userRef = doc(this.firestore, 'users', userId);
      await setDoc(userRef, { isActive: false }, { merge: true });
    } catch (error) {
      console.error('Error disabling user:', error);
      throw error;
    }
  }
  async enableUser(userId: string) {
    try {
      const userRef = doc(this.firestore, 'users', userId);
      await setDoc(userRef, { isActive: true }, { merge: true });
    } catch (error) {
      console.error('Error enabling user:', error);
      throw error;
    }
  }
}