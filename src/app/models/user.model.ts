export interface User{
    id: string;
    firstName: string;
    lastName: string;
    age: number;
    photoUrl: string;
    isActive: boolean;
    isAdmin: boolean;
    favoriteMovies: string[];
}