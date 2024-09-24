import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsuariosService } from 'src/app/Core/Service/UsuariosService';
import { UsuariosServiceImpl } from 'src/app/Core/Service/Implements/UsuariosServiceImpl';
import { UsuariosDto } from 'src/app/Core/Model/UsuariosDto';
import { Location } from '@angular/common';


@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  user: UsuariosDto | null = null;

  constructor(
    private route: ActivatedRoute,
    private userService: UsuariosServiceImpl,
    private location: Location

  ) {}

  ngOnInit() {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.userService.getUserById(+userId).subscribe(
        user => this.user = user,
        error => console.error('Error fetching user details:', error)
      );
      console.log("USERID:", userId),
      console.log("USER:",this.user)
    }
  }

  goBack(): void {
    this.location.back();
  }
}