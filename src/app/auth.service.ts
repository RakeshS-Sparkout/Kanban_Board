import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() {}

  isLoggedIn(): boolean {
    // Example implementation, adjust as needed
    return !!localStorage.getItem('authToken'); // Replace with your actual token check
  }
}
