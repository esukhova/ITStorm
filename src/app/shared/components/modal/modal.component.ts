import {Component, Inject, OnDestroy} from '@angular/core';
import {RequestTypeType} from '../../../../types/requestType.type';
import {FormBuilder, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ServiceType} from '../../../../types/service.type';
import {RequestService} from '../../services/request.service';
import {RequestType} from '../../../../types/request.type';
import {DefaultResponseType} from '../../../../types/default-response.type';
import {HttpErrorResponse} from '@angular/common/http';
import {Subscription} from 'rxjs';

@Component({
  selector: 'modal',
  standalone: false,
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent implements OnDestroy {

  requestType: RequestTypeType = RequestTypeType.order;
  requestTypes = RequestTypeType;
  modalForm;
  selectedService: string;
  successfulRequest: boolean = false;
  badRequest: boolean = false;
  private _subscriptions: Subscription = new Subscription();

  constructor(private fb: FormBuilder,
              private requestService: RequestService,
              private dialogRef: MatDialogRef<any>,
              @Inject(MAT_DIALOG_DATA) public data: {services: ServiceType[],  selectedService: string, type: RequestTypeType}) {

    this.selectedService = data.selectedService;
    this.requestType = data.type;
    this.modalForm = this.fb.group({
      service: [this.selectedService ? this.selectedService : ''],
      name: ['', [Validators.required, Validators.pattern(/^([А-ЯЁ])([а-яё]+)(\s[А-ЯЁ][а-яё]+)*$/)]],
      phone: ['', [Validators.required]],
    });

  }

  closeModal() {
    this.dialogRef.close(this.dialogRef);
  }

  createRequest() {
    if (this.modalForm.valid && this.modalForm.value.name && this.modalForm.value.phone) {

      const paramsObject: RequestType = {
        type: this.requestType,
        name: this.modalForm.value.name,
        phone: this.modalForm.value.phone
      }

      if (this.requestType === RequestTypeType.order) {
        if (this.modalForm.value.service) {
          paramsObject.service = this.modalForm.value.service
        }
      }

      this._subscriptions.add(this.requestService.createRequest(paramsObject as RequestType)
        .subscribe( {
          next: (data: DefaultResponseType) => {
            if (data.error) {
              throw new Error(data.message);
            }

            this.successfulRequest = true;
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error) {
              this.badRequest = true;
            }
          }

        }))
    } else {
      this.modalForm.markAllAsTouched();
    }
  }

  ngOnDestroy() {
    this._subscriptions.unsubscribe();
  }
}
