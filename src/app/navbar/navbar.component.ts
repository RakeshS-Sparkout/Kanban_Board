import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [MatToolbarModule, MatButtonModule], // Import Angular Material modules here
})
export class NavbarComponent {

  constructor(private router: Router) {}

  logout() {
    // Clear the local storage or any other logic for logout
    localStorage.removeItem('loggedInUser');
    this.router.navigate(['/login']);
  }
}
