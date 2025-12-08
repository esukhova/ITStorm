import {Component, OnDestroy, OnInit} from '@angular/core';
import {ArticleService} from "../../../shared/services/article.service";
import {ArticleType} from "../../../../types/article.type";
import {CategoryService} from "../../../shared/services/category.service";
import {CategoryType} from "../../../../types/category.type";
import {ActivatedRoute, Router} from "@angular/router";
import {ActiveParamsType} from "../../../../types/active-params.type";
import {ActiveParamsUtil} from "../../../shared/utils/active-params.util";
import {AppliedFilterType} from "../../../../types/applied-filter.type";
import {debounceTime, Subscription} from "rxjs";

@Component({
  selector: 'app-blog',
  standalone: false,
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss'
})
export class BlogComponent implements OnInit, OnDestroy {

  showLabel: boolean = false;
  articles: ArticleType[] = [];
  categories: CategoryType[] = [];
  filterOpen = false;
  activeParams: ActiveParamsType = {categories: []};
  appliedFilters: AppliedFilterType[] = [];
  pages: number[] = [];
  private _subscriptions: Subscription = new Subscription();

  constructor(private articleService: ArticleService,
              private categoryService: CategoryService,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this._subscriptions.add(this.categoryService.getCategories()
      .subscribe((data: CategoryType[]) => {
        this.categories = data;

        this._subscriptions.add(this.activatedRoute.queryParams
          .pipe(
            debounceTime(500)
          )
          .subscribe(params => {
            this.activeParams = ActiveParamsUtil.processParams(params);

            this.appliedFilters = [];
            this.activeParams.categories.forEach(url => {
              const foundCategory = this.categories.find(category => category.url === url)
              if (foundCategory) {
                this.appliedFilters.push({
                  name: foundCategory.name,
                  urlParam: foundCategory.url
                })
              }
            })

            this._subscriptions.add(this.articleService.getArticles(this.activeParams)
              .subscribe(data => {
                this.pages = [];
                for (let i = 1; i <= data.pages; i++) {
                  this.pages.push(i);
                }

                if (data.items && data.items.length > 0) {
                  this.articles = data.items;
                  this.showLabel = false;
                } else if (data.items && data.items.length === 0) {
                  this.articles = [];
                  this.showLabel = true;
                } else {
                  this.articles = [];
                  this.showLabel = true;
                }
              }));
          }))
      }))
  }

  toggleFilterList() {
    this.filterOpen = !this.filterOpen;
  }

  updateFilterParam(categoryUrl: string, checkedFilter: boolean) {

    if (this.activeParams.categories && this.activeParams.categories.length > 0) {
      const existingCategoryInParams = this.activeParams.categories.find(item => item === categoryUrl);
      if (existingCategoryInParams && !checkedFilter) {
        this.activeParams.categories = this.activeParams.categories.filter(item => item !== categoryUrl);
      } else if (!existingCategoryInParams && checkedFilter) {
        this.activeParams.categories = [...this.activeParams.categories, categoryUrl];
      }
    } else if (checkedFilter) {
      this.activeParams.categories = [categoryUrl];
    }
    this.activeParams.page = 1;
    this.router.navigate(['/blog'], {
      queryParams: this.activeParams
    })
  }

  removeAppliedFilter(appliedFilter: AppliedFilterType) {
    this.activeParams.categories = this.activeParams.categories.filter(category => category !== appliedFilter.urlParam);
    this.activeParams.page = 1;
    this.router.navigate(['/blog'], {
      queryParams: this.activeParams
    })
  }

  openPage(page: number) {
    this.activeParams.page = page;
    this.router.navigate(['/blog'], {
      queryParams: this.activeParams
    })
  }

  openPrevPage() {
    if (this.activeParams.page && this.activeParams.page > 1) {
      this.activeParams.page--;
      this.router.navigate(['/blog'], {
        queryParams: this.activeParams
      })
    }
  }

  openNextPage() {
    if (this.activeParams.page && this.activeParams.page < this.pages.length) {
      this.activeParams.page++;
      this.router.navigate(['/blog'], {
        queryParams: this.activeParams
      })
    }
  }

  ngOnDestroy() {
    this._subscriptions.unsubscribe();
  }
}
