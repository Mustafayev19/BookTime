import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Book, imageLink } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  bookUrl: string = "https://www.googleapis.com/books/v1/volumes?q=filter=free-ebooks&full&key=";
  bookIdUrl: string = "https://www.googleapis.com/books/v1/volumes/";
  searchBookUrl: string = "https://www.googleapis.com/books/v1/volumes?q="
  key: string = "AIzaSyBmBhAzmNNwegpkzuX9IM_gpyxWvG8dI-8"
  searchedValueSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');

  setSearchValue(value: string) {
    this.searchedValueSubject.next(value);
  }

  getSearchValue(): Observable<string> {
    return this.searchedValueSubject.asObservable();
  }
  constructor(private http: HttpClient) { }

  getSearchedBooks(input: string): Observable<Book[]> {
    return this.http.get<any>(`${this.searchBookUrl}${input}&key=${this.key}`).pipe(
      map(response => response.items.slice(0, 8).map((data: any) => this.mapToBook(data)))
    );
  }
  searchedbooks: BehaviorSubject<Book[]> = new BehaviorSubject<Book[]>([]);

  getBookById(id: any): Observable<Book> {
    return this.http.get<any>(`${this.bookIdUrl}${id}?key=${this.key}`).pipe(
      map(response => this.mapToBook(response))
    );
  }


  getRandomBooks(): Observable<Book[]> {
    return this.http.get<any>(`${this.bookUrl}${this.key}`).pipe(
      map(response => response.items.slice(0, 8).map((data: any) => this.mapToBook(data)))
    );
  }

  private mapToBook(data: any): Book {
    const volumeInfo = data.volumeInfo;

    return {
      id: data.id,
      title: volumeInfo.title,
      publisher: volumeInfo.publisher,
      pageCaunt: volumeInfo.pageCount,
      maturityRating: volumeInfo.maturityRating,
      language: volumeInfo.language,
      webReaderLink: data.accessInfo.webReaderLink,
      imageLinks: volumeInfo.imageLinks as imageLink  // Update this line
    };
  }

}  
