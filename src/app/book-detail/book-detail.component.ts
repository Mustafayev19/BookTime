import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Router-i əlavə etdim
import { Observable, of } from 'rxjs'; // of operatorunu əlavə etdim
import { Book } from '../interfaces';
import { BookService } from '../services/Book.service';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css'],
})
export class BookDetailComponent implements OnInit {
  id!: string;
  Book$!: Observable<Book | null>;
  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id = idParam;
      this.Book$ = this.bookService.getBookById(this.id);
    } else {
      console.error('Book ID not found in route parameters. Redirecting...');
      this.router.navigate(['/']);
      this.Book$ = of(null);
    }
  }
}
