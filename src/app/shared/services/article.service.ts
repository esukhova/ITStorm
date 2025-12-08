import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {CategoryType} from "../../../types/category.type";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {ArticleType} from "../../../types/article.type";
import {ActiveParamsType} from "../../../types/active-params.type";

@Injectable({
    providedIn: 'root'
})
export class ArticleService {

    constructor(private http: HttpClient) {
    }

    getPopularArticles(): Observable<ArticleType[]> {
        return this.http.get<ArticleType[]>(environment.api + 'articles/top');
    }

    getRelatedArticles(id: string): Observable<ArticleType[]> {
        return this.http.get<ArticleType[]>(environment.api + 'articles/related/' + id);
    }

    getArticles(params: ActiveParamsType): Observable<{ count: number, pages: number, items: ArticleType[] }> {
        return this.http.get<{ count: number, pages: number, items: ArticleType[] }>(environment.api + 'articles', {
            params: params
        });
    }

    getArticle(url: string): Observable<ArticleType> {
        return this.http.get<ArticleType>(environment.api + 'articles/' + url);
    }
}
