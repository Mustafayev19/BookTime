import { Component } from '@angular/core';
import { BookService } from '../services/Book.service';

@Component({
  selector: 'head-line',
  templateUrl: './head-line.component.html',
  styleUrls: ['./head-line.component.css']
})
export class HeadLineComponent {
  constructor(private bookService: BookService) { }

  getSearchBook(input: string) {
    this.bookService.setSearchValue(input.trim());
  }
}



