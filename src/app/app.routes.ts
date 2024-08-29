import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { authGuard } from './auth.guard';

// Routes configuration
export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  // Allow access to login/register only if the user is NOT logged in
  { path: 'login', component: LoginComponent, canActivate: [authGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [authGuard] },

  // Protect routes for authenticated users
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
];
