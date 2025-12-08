import {Component, OnDestroy, OnInit} from '@angular/core';
import {ArticleService} from "../../shared/services/article.service";
import {ArticleType} from "../../../types/article.type";
import {OwlOptions} from "ngx-owl-carousel-o";
import {ServiceType} from "../../../types/service.type";
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ModalComponent} from '../../shared/components/modal/modal.component';
import {RequestTypeType} from '../../../types/requestType.type';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-main',
    standalone: false,
    templateUrl: './main.component.html',
    styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit, OnDestroy {

    private _subscriptions: Subscription = new Subscription();
    articles: ArticleType[] = [];
    services: ServiceType[] = [
        {
            image: 'service-1',
            title: 'Создание сайтов',
            description: 'В краткие сроки мы создадим качественный и самое главное продающий сайт для продвижения Вашего бизнеса!',
            price: '7 500',
        },
        {
            image: 'service-2',
            title: 'Продвижение',
            description: 'Вам нужен качественный SMM-специалист или грамотный таргетолог? Мы готовы оказать Вам услугу “Продвижения” на наивысшем уровне!',
            price: '3 500',
        },
        {
            image: 'service-3',
            title: 'Реклама',
            description: 'Без рекламы не может обойтись ни один бизнес или специалист. Обращаясь к нам, мы гарантируем быстрый прирост клиентов за счёт правильно настроенной рекламы.',
            price: '1 000',
        },
        {
            image: 'service-4',
            title: 'Копирайтинг',
            description: 'Наши копирайтеры готовы написать Вам любые продающие текста, которые не только обеспечат рост охватов, но и помогут выйти на новый уровень в продажах.',
            price: '750',
        },
    ];

    customOptions: OwlOptions = {
        loop: true,
        mouseDrag: false,
        touchDrag: false,
        pullDrag: false,
        margin: 0,
        dots: true,
        navSpeed: 700,
        navText: ['', ''],
        responsive: {
            0: {
                items: 1
            },
        },
        nav: false
    }

    customOptionsReviews: OwlOptions = {
        loop: true,
        mouseDrag: false,
        touchDrag: false,
        pullDrag: false,
        margin: 25,
        dots: false,
        navSpeed: 700,
        navText: ['', ''],
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 2
            },
            992: {
                items: 3
            },
        },
        nav: false
    }

    mainSlider = [
        {
            label: 'Предложение месяца',
            title: 'Продвижение в&nbsp;Instagram для вашего бизнеса <span class="accent">-15%</span>!',
            subtitle: '',
            image: 'main-1',
            alt: 'Девушка с ноутбуком',
            service: 'Продвижение'
        },
        {
            label: 'Акция',
            title: 'Нужен грамотный  <span class="accent"> копирайтер</span>?',
            subtitle: 'Весь декабрь у нас действует акция на работу копирайтера.',
            image: 'main-2',
            alt: 'Девушка копирайтер',
            service: 'Копирайтинг'
        },
        {
            label: 'Новость дня',
            title: '<span class="accent">6 место</span> в&nbsp;ТОП&#8209;10 <br>SMM&ndash;агенств Москвы!',
            subtitle: 'Мы благодарим каждого, кто голосовал за нас!',
            image: 'main-3',
            alt: 'Девушка SMM-агент',
            service: 'Продвижение'
        },
    ]

    reviewsSlider = [
        {
            name: 'Станислав',
            image: 'reviews-1',
            text: 'Спасибо огромное АйтиШторму за прекрасный блог с полезными статьями! Именно они и побудили меня углубиться в тему SMM и начать свою карьеру.'
        },
        {
            name: 'Алёна',
            image: 'reviews-2',
            text: 'Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! Ребята действительно вкладывают душу в то, что делают, и каждый текст, который я получаю, с нетерпением хочется выложить в сеть.'
        },
        {
            name: 'Мария',
            image: 'reviews-3',
            text: 'Команда АйтиШторма за такой короткий промежуток времени сделала невозможное: от простой фирмы по услуге продвижения выросла в мощный блог о важности личного бренда. Класс!'
        },
    ]

    dialogRef: MatDialogRef<any> | null = null;

    constructor(private articleService: ArticleService,
                private dialog: MatDialog) {
    }

    ngOnInit(): void {
        this._subscriptions.add(this.articleService.getPopularArticles()
            .subscribe((data: ArticleType[]) => {
                this.articles = data;
            }))
    }

    openModal(service: string) {
        this.dialogRef = this.dialog.open(ModalComponent, {
            data: {
                services: this.services,
                selectedService: service,
                type: RequestTypeType.order,
            }
        });
    }

    ngOnDestroy() {
        this._subscriptions.unsubscribe();
    }
}
