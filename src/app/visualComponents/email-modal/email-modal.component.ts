import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-email-modal',
  templateUrl: './email-modal.component.html',
  styleUrls: ['./email-modal.component.css'],
})
export class EmailModalComponent {
  @Input() selectedUsers: any[] = [];
  emailSubject: string = '';
  emailBody: string = '';
  emailAttachments: File[] = [];

  constructor(public activeModal: NgbActiveModal) {}

  handleFileInput(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    if (files) {
      this.emailAttachments = Array.from(files);
    }
  }

  sendEmail(): void {
    const formData = new FormData();
    formData.append('subject', this.emailSubject);
    formData.append('body', this.emailBody);
    this.emailAttachments.forEach((file) =>
      formData.append('attachments', file)
    );
    formData.append('recipients', JSON.stringify(this.selectedUsers.map((u) => u.correo)));

    this.activeModal.close(formData);
  }

  close(): void {
    this.activeModal.dismiss();
  }
}
