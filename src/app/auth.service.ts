import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() {}

  isLoggedIn(): boolean {
    // Check if user data exists in localStorage
    return !!localStorage.getItem('loggedInUser');
  }

  logout(): void {
    // Clear user data from localStorage on logout
    localStorage.removeItem('loggedInUser');
  }
}
