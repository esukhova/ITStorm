import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {CategoryType} from "../../../types/category.type";
import {environment} from "../../../environments/environment";
import {CommentType} from "../../../types/comment.type";
import {DefaultResponseType} from "../../../types/default-response.type";
import {ArticleType} from "../../../types/article.type";
import {CommentsActionsType} from "../../../types/commentsActions.type";

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor(private http: HttpClient) {
  }

  getComments(offset: number, articleId: string): Observable<{ allCount: string, comments: CommentType[] }> {
    return this.http.get<{
      allCount: string,
      comments: CommentType[]
    }>(environment.api + 'comments?offset=' + offset + '&article=' + articleId);
  }

  getCommentsActions(articleId: string): Observable<CommentsActionsType[] | DefaultResponseType> {
    return this.http.get<CommentsActionsType[] | DefaultResponseType>(environment.api + 'comments/article-comment-actions?articleId=' + articleId);
  }

  getCommentActions(commentId: string): Observable<{comment: string, action: 'like' | 'dislike' | 'violate'}[] | DefaultResponseType> {
    return this.http.get<{ comment: string, action: 'like' | 'dislike' | 'violate'}[] | DefaultResponseType>(environment.api + 'comments/' + commentId + '/actions');
  }

  updateCommentActions(commentId: string, action: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments/' + commentId + '/apply-action', {action})
  }

  addComment(text: string, articleId: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments', {text, article: articleId})
  }
}
