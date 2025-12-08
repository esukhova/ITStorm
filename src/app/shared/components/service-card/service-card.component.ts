import {Component, Input} from '@angular/core';
import {ServiceType} from "../../../../types/service.type";
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ModalComponent} from '../modal/modal.component';
import {RequestTypeType} from '../../../../types/requestType.type';

@Component({
    selector: 'service-card',
    standalone: false,
    templateUrl: './service-card.component.html',
    styleUrl: './service-card.component.scss'
})
export class ServiceCardComponent {

    @Input() service!: ServiceType;
    @Input() services!: ServiceType[];
    dialogRef: MatDialogRef<any> | null = null;

    constructor(private dialog: MatDialog) {
    }

    openModal() {
        this.dialogRef = this.dialog.open(ModalComponent, {
            data: {
                services: this.services,
                selectedService: this.service.title,
                type: RequestTypeType.order,
            }
        });
    }
}
