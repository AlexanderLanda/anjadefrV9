import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserCuestionarioServiceImpl } from 'src/app/Core/Service/Implements/UserCuestionarioServiceImpl';

@Component({
  selector: 'app-user-cuestionario-details',
  templateUrl: './user-cuestionario-details.component.html',
  styleUrls: ['./user-cuestionario-details.component.css']
})
export class UserCuestionarioDetailsComponent implements OnInit {
  cuestionarios: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private userService: UserCuestionarioServiceImpl
  ) {}

  ngOnInit() {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.userService.getCuestionarioByUserId(+userId).subscribe(
        data => this.cuestionarios = data,
        error => console.error('Error fetching cuestionario details:', error)
      );
    }
  }
}