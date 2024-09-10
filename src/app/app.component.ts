import { Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  ngOnInit() {
    /* ERUDA PARA CONSOLA EN PRODUCCION DE CLIENTES
    if (environment.enableEruda) {
      import('eruda').then(eruda => (eruda as any).init());
    }*/
  }
  title = 'anjadefrV9';
}
