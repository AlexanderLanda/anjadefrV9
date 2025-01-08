import { Component } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { JuntaDirectivaComponent } from "../junta-directiva/junta-directiva.component";
import { $ } from 'protractor';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChristmasModalContentComponent } from '../christmas-modal-content.component';
import { AyudaChatComponent } from '../ayuda-chat/ayuda-chat.component';

@Component({
  selector: 'app-home-component',
  templateUrl: './home-component.component.html',
  styleUrls: ['./home-component.component.css']
})
export class HomeComponentComponent {

  constructor(private router: Router, private modalService: NgbModal) { }

  ngOnInit(): void {
    const modalShown = localStorage.getItem('modalShown');
    // Abre el modal programáticamente
    
    /*this.openChristmasModal();
    if (!modalShown) {
      // Marca que el modal fue mostrado
      localStorage.setItem('modalShown', 'true');

      // Abre el modal programáticamente
      this.openChristmasModal();
    }*/
  }

  irARegistro() {
    this.router.navigate(['/registro']);
  }

  openChristmasModal() {
    const modalRef = this.modalService.open(ChristmasModalContentComponent, {
      centered: true,
    });
    modalRef.result.finally(() => {
      console.log('Modal cerrado');
    });
  }
}
