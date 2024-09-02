import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alerta-safari',
  templateUrl: './alerta-safari.component.html',
  styleUrls: ['./alerta-safari.component.css']
})
export  class AlertaSafariComponent {

constructor(private router: Router,){}

  cerrarAlerta(){
    this.router.navigate(['/registro']);
  }
}
