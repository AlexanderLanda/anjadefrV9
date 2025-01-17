import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../Core/Service/Implements/AuthService';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export  class LoginComponent {
  
  loginForm: FormGroup;
  hide = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      idAfiliacion: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onLogin() {
    if (this.loginForm.valid) {
      const { idAfiliacion, password } = this.loginForm.value;
      this.authService.login(idAfiliacion, password).subscribe({
        next: (response) => {
          if (response.success) {
            // Redirige al usuario según su rol
            this.router.navigate([response.redirectUrl]);
          }
        },
        error: (error) => {
          alert("Error de autenticación");
        },
      });
    }
  }

}
