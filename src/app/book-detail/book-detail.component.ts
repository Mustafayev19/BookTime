import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Router-i əlavə etdim
import { Observable, of } from 'rxjs'; // of operatorunu əlavə etdim
import { Book } from '../interfaces';
import { BookService } from '../services/Book.service';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit {
  id!: string; // və ya number (Book interfeysindəki id tipinə uyğun)
  Book$!: Observable<Book | null>; // Tip Book və ya null ola bilər

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private router: Router // Router-i inject etdim
  ) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      // idParam-ın tipinin bookService.getBookById metodunun gözlədiyi tipə uyğun olduğundan əmin olun
      // Məsələn, əgər getBookById number gözləyirsə: this.id = +idParam;
      this.id = idParam;
      this.Book$ = this.bookService.getBookById(this.id);
    } else {
      console.error('Book ID not found in route parameters. Redirecting...');
      this.router.navigate(['/']); // və ya bir "not-found" səhifəsinə
      this.Book$ = of(null); // Book$ üçün bir dəyər mənimsətmək (null emit edən observable)
    }
  }
}