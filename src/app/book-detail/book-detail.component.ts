import { Component, OnInit } from '@angular/core';
import { BookService } from '../services/google-api.service';
import { Book } from '../interfaces';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit {
  Book$!: Observable<Book>
  id: any;
  constructor(private bookService: BookService, private activatedRoute: ActivatedRoute) {

  }
  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.Book$ = this.bookService.getBookById(this.id)
  }
}
