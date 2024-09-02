import { Component } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { JuntaDirectivaComponent } from "../junta-directiva/junta-directiva.component";

@Component({
    selector: 'app-home-component',
    templateUrl: './home-component.component.html',
    styleUrls: ['./home-component.component.css']
})
export  class HomeComponentComponent {

    constructor(private router: Router) { }
    irARegistro() {
        this.router.navigate(['/registro']);
      }
    
}
