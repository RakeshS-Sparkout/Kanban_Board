import { Component, OnInit } from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { Router } from '@angular/router';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,MatFormFieldModule, MatInputModule, MatSelectModule,MatButtonModule,MatCardModule, FormsModule, ReactiveFormsModule ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    })
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;

      this.http.get<any[]>(`http://localhost:3000/users?email=${email}`).subscribe(
        (users: any[]) => {
          if (Array.isArray(users) && users.length > 0) {
            const user = users[0];
            if (user.password === password) {
              console.log('Login successful:', user);
              this.router.navigate(['/home']); 
            
              // Store the logged-in user data in localStorage
              localStorage.setItem('loggedInUser', JSON.stringify(user));
            } else {
              alert('Invalid password!');
            }
          } else {
            alert('You are a new user, please register!');
            this.router.navigate(['/register']);
          }
        },
        error => {
          console.error('Error during login:', error);
          alert('An error occurred while trying to login. Please try again.');
        }
      );
    } else {
      alert('Please fill in all required fields!');
    }
  }

  navigateToRegister(){
    this.router.navigate(['/register']);
  }

}
