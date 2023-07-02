import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Book, imageLink } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  bookUrl: string = "https://www.googleapis.com/books/v1/volumes?q=filter=free-ebooks&full&key=AIzaSyBmBhAzmNNwegpkzuX9IM_gpyxWvG8dI-8";
  bookIdUrl: string = "https://www.googleapis.com/books/v1/volumes/";
  key: string = "?key=AIzaSyBmBhAzmNNwegpkzuX9IM_gpyxWvG8dI-8"
  constructor(private http: HttpClient) { }

  getBookById(id: any): Observable<Book> {
    return this.http.get<any>(`${this.bookIdUrl}${id}${this.key}`).pipe(
      map(response => this.mapToRandomBook(response))
    );
  }


  getRandomBooks(): Observable<Book[]> {
    return this.http.get<any>(this.bookUrl).pipe(
      map(response => response.items.slice(0, 8).map((data: any) => this.mapToRandomBook(data)))
    );
  }

  private mapToRandomBook(data: any): Book {
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
