import {Component, OnDestroy, OnInit} from '@angular/core';
import {LoaderService} from '../../services/loader.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-loader',
  standalone: false,
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss'
})
export class LoaderComponent implements OnInit, OnDestroy {
  isShowed: boolean = false;
  private _subscriptions: Subscription = new Subscription();

  constructor(private loaderService: LoaderService) {
  }

  ngOnInit() {
    this._subscriptions.add(this.loaderService.isShowed$.subscribe((isShowed: boolean) => {
      this.isShowed = isShowed;
    }))
  }

  ngOnDestroy() {
    this._subscriptions.unsubscribe();
  }
}
