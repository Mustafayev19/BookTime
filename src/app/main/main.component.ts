import { Component, OnDestroy, OnInit } from '@angular/core';
import { BookService } from '../services/Book.service';
import { Observable, Subject, Subscription } from 'rxjs';
import { Book } from '../interfaces';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit, OnDestroy {
  // İlkin "təsadüfi" kitablar üçün
  randomBooks$!: Observable<Book[]>;

  // Səhifələnmiş axtarış üçün yeni xüsusiyyətlər
  paginatedBooks: Book[] = [];
  currentPage: number = 1;
  totalResults: number = 0;
  pageSize: number = 12; // Dəyişdirilə bilər
  isLoading: boolean = false;

  searchedValue: string = '';
  // Axtarış sorğusunu gecikmə ilə idarə etmək üçün Subject
  private searchSubject = new Subject<string>();
  private paginationSubscription!: Subscription;

  constructor(private bookService: BookService, private router: Router) {}

  ngOnInit(): void {
    // İlkin təsadüfi kitabları yüklə
    this.randomBooks$ = this.bookService.getRandomBooks();

    // Səhifələnmiş nəticələri dinlə
    this.paginationSubscription = this.bookService.books$.subscribe(
      (response) => {
        this.isLoading = false;
        if (response) {
          this.paginatedBooks = response.books;
          this.totalResults = response.totalItems;
        } else {
          // Axtarış təmizləndikdə və ya xəta baş verdikdə
          this.paginatedBooks = [];
          this.totalResults = 0;
        }
      }
    );

    // Axtarış sorğusunu debounce ilə idarə et
    this.searchSubject
      .pipe(
        debounceTime(400), // İstifadəçi yazmağı dayandırdıqdan 400ms sonra
        distinctUntilChanged(), // Yalnız dəyər dəyişdikdə
        tap(() => {
          this.isLoading = true; // Yüklənmə indikatorunu göstər
          this.paginatedBooks = []; // Köhnə nəticələri təmizlə
          this.totalResults = 0;
        })
      )
      .subscribe((query) => {
        this.currentPage = 1; // Yeni axtarışda həmişə 1-ci səhifəyə qayıt
        this.bookService.searchBooks(query, this.currentPage, this.pageSize);
      });
  }

  ngOnDestroy(): void {
    // Yaddaş sızmasının qarşısını almaq üçün subscription-ları dayandır
    if (this.paginationSubscription) {
      this.paginationSubscription.unsubscribe();
    }
    this.searchSubject.complete();
  }

  // Axtarış qutusuna hər dəfə simvol daxil edildikdə çağırılır
  onSearchChange(): void {
    this.searchSubject.next(this.searchedValue.trim());
  }

  // Səhifələmə metodları
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || this.isLoading) {
      return;
    }
    this.currentPage = page;
    this.isLoading = true;
    this.bookService.searchBooks(
      this.searchedValue.trim(),
      this.currentPage,
      this.pageSize
    );
  }

  get totalPages(): number {
    if (this.totalResults === 0) return 0;
    return Math.ceil(this.totalResults / this.pageSize);
  }

  // Detallı səhifəyə keçid
  bookDetail(id: any): void {
    this.router.navigateByUrl(`/book-detail/${String(id)}`);
  }
}
