import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {ArticleType} from "../../../../types/article.type";
import {CommentType} from "../../../../types/comment.type";
import {CommentsService} from "../../services/comments.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {AuthService} from "../../../core/auth/auth.service";
import {CommentsActionsType} from "../../../../types/commentsActions.type";
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoaderService} from '../../services/loader.service';
import {CommentActionType} from '../../../../types/commentAction.type';
import {Subscription} from 'rxjs';

@Component({
    selector: 'comments',
    standalone: false,
    templateUrl: './comments.component.html',
    styleUrl: './comments.component.scss'
})
export class CommentsComponent implements OnInit, OnChanges, OnDestroy {

    @Input() article!: ArticleType;
    comments: CommentType[] | undefined = [];
    commentsActions: CommentsActionsType[] = [];
    isLoggedIn: boolean = false;
    currentCommentsCount: number = 3;
    public comment: string = '';
    public loadingMoreComments: boolean = false;

    private _subscriptions: Subscription = new Subscription();

    constructor(private commentsService: CommentsService,
                private authService: AuthService,
                private loaderService: LoaderService,
                private _snackBar: MatSnackBar) {
    }

    ngOnInit() {
        this.comments = this.article.comments;
        this.isLoggedIn = this.authService.getIsLoggedIn();
        this.getCommentsActions();
    }

    getCommentsActions() {
        if (this.authService.getIsLoggedIn()) {
            this._subscriptions.add(this.commentsService.getCommentsActions(this.article.id)
                .subscribe((data: CommentsActionsType[] | DefaultResponseType) => {
                    if ((data as DefaultResponseType).error !== undefined) {
                        throw new Error((data as DefaultResponseType).message);
                    }
                    this.commentsActions = data as CommentsActionsType[];
                    if (this.comments && this.comments.length !== 0) {
                        this.comments.forEach(comment => {
                            const foundComment = this.commentsActions.find(commentActions => commentActions.comment === comment.id);
                            if (foundComment) {
                                switch (foundComment.action) {
                                    case 'like':
                                        comment.isLiked = true;
                                        comment.isDisliked = false;
                                        break;
                                    case 'dislike':
                                        comment.isDisliked = true;
                                        comment.isLiked = false;
                                        break;
                                    default:
                                        return;
                                }
                            }
                        })
                    }
                }))
        }
    }

    updateCommentActions(comment: CommentType, action: CommentActionType) {
        if (!this.authService.getIsLoggedIn()) {
            this._snackBar.open('Для добавления реакции необходимо авторизоваться');
            return;
        }
        this._subscriptions.add(this.commentsService.updateCommentActions(comment.id, action)
            .subscribe(
                {
                    next: (data: DefaultResponseType) => {
                        if (data.error) {
                            const error = data.message;
                            throw new Error(error);
                        }
                        this.getComments();
                        this.updateCommentState(comment.id, action);
                    },
                    error: (error) => {
                        if (error.error.message === 'Это действие уже применено к комментарию' && action === 'violate') {
                            this._snackBar.open('Жалоба уже отправлена');
                        }
                    }
                }))
    }

    updateCommentState(commentId: string, action: CommentActionType) {
        if (this.comments && this.comments.length !== 0) {
            const foundComment = this.comments.find(commentItem => commentItem.id === commentId)
            if (foundComment) {
                if (action === 'like') {
                    foundComment.isLiked = foundComment.isLiked ? !foundComment.isLiked : true;
                    foundComment.isDisliked = false;
                    this._snackBar.open('Ваш голос учтен');
                } else if (action === 'dislike') {
                    foundComment.isDisliked = foundComment.isDisliked !== true;
                    foundComment.isLiked = false;
                    this._snackBar.open('Ваш голос учтен');
                } else if (action === 'violate') {
                    this._snackBar.open('Жалоба отправлена');
                }
            }
        }
    }

    addComment(text: string) {
        if (text && text.length > 0) {
            this._subscriptions.add(this.commentsService.addComment(text, this.article.id)
                .subscribe((data: DefaultResponseType) => {
                    if (data.error) {
                        const error = data.message;
                        throw new Error(error);
                    }
                    this._subscriptions.add(this.commentsService.getComments(0, this.article.id)
                        .subscribe((data: { allCount: string, comments: CommentType[] }) => {
                            if (this.comments) {
                                this.comment = '';
                            }
                            this.comments = data.comments.slice(0, this.currentCommentsCount);
                        }))
                }))
        }
    }

    showMoreComments() {
        this.loaderService.show();
        this.loadingMoreComments = true;
        this._subscriptions.add(this.commentsService.getComments(this.currentCommentsCount, this.article.id)
            .subscribe((data: { allCount: string, comments: CommentType[] }) => {
                if (this.comments) {
                    this.comments = [...this.comments, ...data.comments];
                    this.currentCommentsCount += 10;
                    this.currentCommentsCount = this.currentCommentsCount > this.article.commentsCount ? this.article.commentsCount : this.currentCommentsCount;
                }
                this.loadingMoreComments = false;
            }))
    }

    getComments() {
        this._subscriptions.add(this.commentsService.getComments(0, this.article.id)
            .subscribe((data: { allCount: string, comments: CommentType[] }) => {
                if (this.comments) {
                    this.comments = data.comments.slice(0, this.currentCommentsCount);
                    this.getCommentsActions();
                }
            }))
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['article'] && changes['article'].currentValue) {
            this.comments = this.article.comments;
            this.getCommentsActions();
        }
    }

    ngOnDestroy() {
        this._subscriptions.unsubscribe();
    }
}
