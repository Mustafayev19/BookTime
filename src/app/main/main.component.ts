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
  randomBooks$!: Observable<Book[]>;

  paginatedBooks: Book[] = [];
  currentPage: number = 1;
  totalResults: number = 0;
  pageSize: number = 12;
  isLoading: boolean = false;

  searchedValue: string = '';
  private searchSubject = new Subject<string>();
  private paginationSubscription!: Subscription;

  constructor(private bookService: BookService, private router: Router) {}

  ngOnInit(): void {
    this.randomBooks$ = this.bookService.getRandomBooks();

    this.paginationSubscription = this.bookService.books$.subscribe(
      (response) => {
        this.isLoading = false;
        if (response) {
          this.paginatedBooks = response.books;
          this.totalResults = response.totalItems;
        } else {
          this.paginatedBooks = [];
          this.totalResults = 0;
        }
      }
    );

    this.searchSubject
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          this.paginatedBooks = [];
          this.totalResults = 0;
        })
      )
      .subscribe((query) => {
        this.currentPage = 1;
        this.bookService.searchBooks(query, this.currentPage, this.pageSize);
      });
  }

  ngOnDestroy(): void {
    if (this.paginationSubscription) {
      this.paginationSubscription.unsubscribe();
    }
    this.searchSubject.complete();
  }

  onSearchChange(): void {
    this.searchSubject.next(this.searchedValue.trim());
  }

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
  bookDetail(id: any): void {
    this.router.navigateByUrl(`/book-detail/${String(id)}`);
  }
}
