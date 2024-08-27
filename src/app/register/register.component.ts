import { Component } from '@angular/core';
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
  ValidatorFn,
  ValidationErrors,
  AbstractControl,
} from '@angular/forms';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { catchError, map, Observable } from 'rxjs';
import { HttpBackend, HttpClient } from '@angular/common/http';

export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.value;

    if (!password) {
      return null; 
    }

    // Check password conditions
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isValidLength = password.length >= 8;

    // Check if all conditions are met
    const valid = hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && isValidLength;

    return !valid ? { passwordStrength: true } : null; // Return error object if invalid
  };
}


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule,MatFormFieldModule, MatInputModule, MatSelectModule,MatButtonModule,MatCardModule,FormsModule,ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;

  constructor(private router: Router, private http: HttpClient){}

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('',[Validators.required, Validators.email]),
      password: new FormControl('',[Validators.required, passwordValidator()]),
      confirm: new FormControl('', Validators.required)
    })
  }

  onSubmit() {
    if (this.registerForm.valid && this.registerForm.value.password === this.registerForm.value.confirm) {
      this.checkEmailExists(this.registerForm.value.email).subscribe(exists => {
        if (exists) {
          alert("Your email is already registered!");
        } else {
          this.http.post('http://localhost:3000/users', this.registerForm.value).subscribe ({
            next: (response) => {
              console.log('Account Registered:',response);
              this.router.navigate(['/login']);
            },
            error: (err) => {
              console.log(err);
            }
          });
        }
      });
    } else {
      if (this.registerForm.invalid){
        alert("Form is invalid,Please fill all the fields!");
      }else {
        alert('Password do not match!');
      }
    }
  }

  checkEmailExists(email: string): Observable<boolean> {
    return this.http.get<any[]>(`http://localhost:3000/users?email=${email}`).pipe(
      map(accounts => {
        console.log('Accounts found:', accounts); 
        return Array.isArray(accounts) && accounts.length > 0;
      }),
      catchError(() => {
        console.error('Error checking email existence'); 
        return [false]; 
      })
    );
  }



  navigateToLogin(){
    this.router.navigate(['/login']);
  }

}
