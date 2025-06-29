import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  of,
  switchMap,
  distinctUntilChanged,
  debounceTime,
  map,
  catchError,
} from 'rxjs';
import { Book } from '../interfaces';
import { environment } from '../../environments/environment';

export interface PaginatedBookResponse {
  books: Book[];
  totalItems: number;
}

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private apiKey = environment.googleBooksApiKey;
  private baseUrl = environment.googleBooksApiBaseUrl;

  private searchedValueSubject = new BehaviorSubject<string>('');
  public searchedBooks$: Observable<Book[]> = this.searchedValueSubject
    .asObservable()
    .pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((inputValue) => {
        if (!inputValue || inputValue.trim() === '') {
          return of([]);
        }
        const url = `${this.baseUrl}?q=${encodeURIComponent(inputValue)}&key=${
          this.apiKey
        }&maxResults=8`;
        return this.http.get<any>(url).pipe(
          map((response) => this.mapResponseToBooks(response)),
          catchError((error) => {
            console.error('Error fetching live search books:', error);
            return of([]);
          })
        );
      })
    );

  private booksSubject = new BehaviorSubject<PaginatedBookResponse | null>(
    null
  );
  public books$ = this.booksSubject.asObservable();

  constructor(private http: HttpClient) {}

  setSearchValue(value: string): void {
    this.searchedValueSubject.next(value);
  }

  searchBooks(query: string, page: number = 1, pageSize: number = 12): void {
    if (!query || query.trim() === '') {
      this.booksSubject.next(null);
      return;
    }

    const startIndex = (page - 1) * pageSize;
    const url = `${this.baseUrl}?q=${encodeURIComponent(query)}&key=${
      this.apiKey
    }&maxResults=${pageSize}&startIndex=${startIndex}`;

    this.http
      .get<any>(url)
      .pipe(
        map(
          (response): PaginatedBookResponse => ({
            books: this.mapResponseToBooks(response),
            totalItems: response.totalItems || 0,
          })
        ),
        catchError((error) => {
          console.error('Error fetching paginated books:', error);
          this.booksSubject.next({ books: [], totalItems: 0 });
          return of(null);
        })
      )
      .subscribe((response) => {
        if (response) {
          this.booksSubject.next(response);
        }
      });
  }

  getBookById(id: string): Observable<Book | null> {
    const url = `${this.baseUrl}/${id}?key=${this.apiKey}`;
    return this.http.get<any>(url).pipe(
      map((response) => this.mapToBook(response)),
      catchError((error) => {
        console.error(`Error fetching book with id ${id}:`, error);
        return of(null);
      })
    );
  }

  getRandomBooks(): Observable<Book[]> {
    const randomSubjects = [
      'fiction',
      'science',
      'history',
      'classics',
      'adventure',
      'fantasy',
      'biography',
      'programming',
      'art',
    ];
    const randomQuery =
      randomSubjects[Math.floor(Math.random() * randomSubjects.length)];

    const randomIndex = Math.floor(Math.random() * 100);

    const url = `${this.baseUrl}?q=subject:${randomQuery}&key=${this.apiKey}&maxResults=8&startIndex=${randomIndex}`;

    return this.http.get<any>(url).pipe(
      map((response) => this.mapResponseToBooks(response)),
      catchError((error) => {
        console.error('Error fetching random books:', error);
        return of([]);
      })
    );
  }

  private mapResponseToBooks(response: any): Book[] {
    return response.items && Array.isArray(response.items)
      ? response.items.map((data: any) => this.mapToBook(data))
      : [];
  }

  private mapToBook(data: any): Book {
    const volumeInfo = data.volumeInfo || {};
    return {
      id: data.id,
      title: volumeInfo.title || 'No Title Available',
      publisher: volumeInfo.publisher,
      pageCaunt: volumeInfo.pageCount,
      maturityRating: volumeInfo.maturityRating,
      language: volumeInfo.language,
      webReaderLink: data.accessInfo?.webReaderLink,
      imageLinks: volumeInfo.imageLinks || {
        smallThumbnail: '',
        thumbnail: '',
      },
    };
  }
}
