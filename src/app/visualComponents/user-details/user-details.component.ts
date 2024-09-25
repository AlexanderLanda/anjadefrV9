import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsuariosService } from 'src/app/Core/Service/UsuariosService';
import { UsuariosServiceImpl } from 'src/app/Core/Service/Implements/UsuariosServiceImpl';
import { UsuariosDto } from 'src/app/Core/Model/UsuariosDto';
import { Location } from '@angular/common';
import { UserCuestionarioServiceImpl } from 'src/app/Core/Service/Implements/UserCuestionarioServiceImpl';
import { Router } from '@angular/router';



@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  user: UsuariosDto | null = null;
  hasCuestionario: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UsuariosServiceImpl,
    private location: Location,
    private userCuestionarioServiceImpl: UserCuestionarioServiceImpl

  ) {}

  ngOnInit() {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.userService.getUserById(+userId).subscribe(
        user => {
          this.user = user,
          this.checkCuestionario(user.id_user);
        },
        error => console.error('Error fetching user details:', error)
      );
      console.log("USERID:", userId),
      console.log("USER:",this.user)
    }
  }

  goBack(): void {
    this.location.back();
  }

  checkCuestionario(userId: number) {
    this.userCuestionarioServiceImpl.hasCuestionario(userId).subscribe(
      has => this.hasCuestionario = has,
      error => console.error('Error checking cuestionario:', error)
    );
  }

  verCuestionario() {
    if (this.hasCuestionario) {
      this.router.navigate(['/user-cuestionario', this.user.id_user]);
    }
  }
}