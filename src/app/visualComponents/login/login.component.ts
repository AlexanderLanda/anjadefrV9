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
      this.authService.login(idAfiliacion, password).subscribe(
        (res: { success: any; message: any; }) => {
          // Manejar la respuesta de autenticación
          if (res.success) {
            // Redirigir a la página principal o a otra página deseada
            this.router.navigate(['/']);
          } else {
            // Mostrar un mensaje de error
            alert(res.message);
          }
        },
        (err) => {
          // Manejar errores
          alert('Error de autenticación');
        }
      );
    }
  }

}
