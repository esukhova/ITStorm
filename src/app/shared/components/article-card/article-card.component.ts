import {Component, Input} from '@angular/core';
import {ArticleType} from "../../../../types/article.type";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'article-card',
  standalone: false,
  templateUrl: './article-card.component.html',
  styleUrl: './article-card.component.scss'
})
export class ArticleCardComponent {

    serverStaticPath = environment.serverStaticPath;

    @Input() article!: ArticleType;
    @Input() toggleBottomSheet!: () => void;

  onReadMoreClick(): void {
    if (this.toggleBottomSheet) {
      this.toggleBottomSheet();
    }
  }
}
