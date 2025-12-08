import {Component} from '@angular/core';
import {ModalComponent} from '../../components/modal/modal.component';
import {RequestTypeType} from '../../../../types/requestType.type';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-footer',
    standalone: false,
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss'
})
export class FooterComponent {

    dialogRef: MatDialogRef<any> | null = null;

    constructor(private dialog: MatDialog) {
    }

    openModal() {
        this.dialogRef = this.dialog.open(ModalComponent, {
            data: {
                type: RequestTypeType.consultation,
            }
        });
    }

}
