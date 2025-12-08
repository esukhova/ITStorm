import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ArticleCardComponent} from './components/article-card/article-card.component';
import {RouterModule} from "@angular/router";
import {CommentsComponent} from './components/comments/comments.component';
import {ServiceCardComponent} from './components/service-card/service-card.component';
import {ModalComponent} from './components/modal/modal.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';
import {LoaderComponent} from './components/loader/loader.component';
import {CardLoaderComponent} from './components/card-loader/card-loader.component';

@NgModule({
    declarations: [
        ArticleCardComponent,
        CommentsComponent,
        ServiceCardComponent,
        ModalComponent,
        LoaderComponent,
        CardLoaderComponent
    ],
    exports: [
        ArticleCardComponent,
        ServiceCardComponent,
        CommentsComponent,
        LoaderComponent,
        CardLoaderComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        MatDialogModule,
        FormsModule,
    ]
})
export class SharedModule {
}
