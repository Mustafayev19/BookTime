import { Component, OnDestroy, OnInit } from '@angular/core';
import { BookService } from '../services/Book.service';
import { Observable, Subscription } from 'rxjs';
import { Book } from '../interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit, OnDestroy {
  constructor(private bookService: BookService, private router: Router) { }

  randomBooks$!: Observable<Book[]>;
  searchedBooks$: Observable<Book[]> | undefined;
  searchedValue: string = '';
  searchedValueSubscription!: Subscription;

  ngOnInit(): void {
    this.randomBooks$ = this.bookService.getRandomBooks();
    this.searchedValueSubscription = this.bookService.getSearchValue().subscribe(value => {
      this.searchedValue = value;
      if (this.searchedValue) {
        this.searchedBooks$ = this.bookService.getSearchedBooks(this.searchedValue);
      } else {
        this.searchedBooks$ = undefined;
      }
    });
  }


  bookDetail(id: any) {
    this.router.navigateByUrl("/book-detail/" + id);
  }

  ngOnDestroy(): void {
    this.searchedValueSubscription.unsubscribe();
  }
}
