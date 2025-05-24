import { Component, OnInit } from '@angular/core';
import { BookService } from '../services/Book.service'; // Düzgün yolu göstərin
import { Observable } from 'rxjs';
import { Book } from '../interfaces'; // Düzgün yolu göstərin
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  randomBooks$!: Observable<Book[]>;
  searchedBooks$: Observable<Book[]>;
  searchedValue: string = ''; // [(ngModel)] ilə bağlı input üçün

  constructor(private bookService: BookService, private router: Router) {
    // Servisdəki searchedBooks$ observable-nı birbaşa komponentin xassəsinə mənimsədirik
    this.searchedBooks$ = this.bookService.searchedBooks$;
  }

  ngOnInit(): void {
    this.randomBooks$ = this.bookService.getRandomBooks();
    // Səhifə yüklənəndə ilkin bir axtarış və ya nəticələrin təmizlənməsi üçün:
    // this.bookService.setSearchValue(this.searchedValue); // Əgər searchedValue-da ilkin dəyər varsa
    // Və ya
    // this.bookService.setSearchValue(''); // Həmişə boş nəticə ilə başlamaq üçün
  }

  // [(ngModel)] ilə bağlı inputun dəyəri dəyişdikdə çağırılır
  onSearchModelChange(): void {
    // Servisdəki debounceTime sayəsində hər hərf daxil edilməsinə dərhal sorğu getməyəcək
    this.bookService.setSearchValue(this.searchedValue.trim());
  }

  // Bir düymə və ya Enter ilə birbaşa axtarış etmək üçün metod (parametrli)
  // HTML-də bu metod çağırılmırsa, onu saxlamağa ehtiyac yoxdur.
  // Əgər saxlayırsınızsa, HTML-də uyğun yerdə (məsələn, bir düymənin (click) hadisəsində) çağırın.
  handleDirectSearch(query: string): void {
    this.searchedValue = query; // Inputu yeniləmək üçün (əgər birbaşa inputdan gəlmirsə)
    this.bookService.setSearchValue(query.trim());
  }

  // Parametri 'any' və ya 'string | number' edib, daxildə string-ə çevirə bilərsiniz
  bookDetail(id: any): void { // və ya id: string | number
    this.router.navigateByUrl(`/book-detail/${String(id)}`); // <--- String(id) ilə çevirmə
  }
}