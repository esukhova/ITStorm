import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ArticleRoutingModule} from './article-routing.module';
import {BlogComponent} from './blog/blog.component';
import {ArticleComponent} from './article/article.component';
import {SharedModule} from "../../shared/shared.module";
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';


@NgModule({
    declarations: [
        BlogComponent,
        ArticleComponent
    ],
    imports: [
        CommonModule,
        ArticleRoutingModule,
        MatBottomSheetModule,
        SharedModule
    ]
})
export class ArticleModule {
}
