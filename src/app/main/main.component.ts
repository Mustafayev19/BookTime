import { Component, OnInit } from '@angular/core';
import { BookService } from '../services/google-api.service';
import { Observable } from 'rxjs';
import { Book } from '../interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  constructor(private bookService: BookService, private router: Router) { }
  randomBooks$!: Observable<Book[]>;

  ngOnInit(): void {
    this.randomBooks$ = this.bookService.getRandomBooks();
    console.log(this.randomBooks$);
  }

  bookDetail(id: any) {
    this.router.navigateByUrl("/book-detail/" + id)
  }

}
