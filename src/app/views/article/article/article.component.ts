import {
  AfterViewInit,
  Component,
  ElementRef, OnDestroy,
  OnInit,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {ArticleService} from "../../../shared/services/article.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ArticleType} from "../../../../types/article.type";
import {environment} from "../../../../environments/environment";
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-article',
  standalone: false,
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ArticleComponent implements OnInit, OnDestroy {

  article!: ArticleType;
  relatedArticles: ArticleType[] = [];
  serverStaticPath = environment.serverStaticPath;
  private _subscriptions: Subscription = new Subscription();

  @ViewChild('articleBodyContent', {static: false}) articleBodyContent!: ElementRef;

  @ViewChild('bottomSheetTemplate') bottomSheetTemplate!: TemplateRef<any>;
  private _bottomSheetRef: any;
  bottomSheetOpened: boolean = false;

  constructor(private articleService: ArticleService,
              private activatedRoute: ActivatedRoute,
              private renderer: Renderer2,
              private _bottomSheet: MatBottomSheet) {
  }

  ngOnInit() {
    this._subscriptions.add(this.activatedRoute.params.subscribe(params => {
      this._subscriptions.add(this.articleService.getArticle(params['url'])
      .subscribe((data: ArticleType) => {
          this.article = data;
          setTimeout(() => {
            const h1 = this.articleBodyContent.nativeElement.querySelector('h1');
            if (h1) {
              this.renderer.removeChild(this.articleBodyContent.nativeElement, h1);
            }
          }, 100)
        }))

      this._subscriptions.add(this.articleService.getRelatedArticles(params['url'])
        .subscribe((data: ArticleType[]) => {
          this.relatedArticles = data;
        }))
    }))
  }

  openBottomSheet(): void {
    this._bottomSheetRef = this._bottomSheet.open(this.bottomSheetTemplate, {
      hasBackdrop: true,
      panelClass: 'related-bottom-sheet',
    });
    this.bottomSheetOpened = true;
  }

  closeBottomSheet(): void {
    if (this._bottomSheetRef) {
      this._bottomSheetRef.dismiss();
      setTimeout(()=> {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        })
      }, 500);
    }
    this.bottomSheetOpened = false;
  }

  toggleBottomSheet = () => {
    if (this.bottomSheetOpened === false) {
      this.openBottomSheet();
    } else {
      this.closeBottomSheet();
    }
  }

  ngOnDestroy() {
    this._subscriptions.unsubscribe();
  }
}
