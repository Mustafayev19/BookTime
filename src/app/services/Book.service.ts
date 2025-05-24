// src/app/services/Book.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, switchMap, distinctUntilChanged, debounceTime, map, catchError } from 'rxjs';
import { Book } from '../interfaces'; // Düzgün yolu göstərin
import { environment } from '../../environments/environment'; // Düzgün yolu göstərin

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiKey = environment.googleBooksApiKey;
  private baseUrl = environment.googleBooksApiBaseUrl;

  private searchedValueSubject = new BehaviorSubject<string>('');

  // Bu public observable xassəsidir, komponentlər buna qoşulacaq
  public searchedBooks$: Observable<Book[]> = this.searchedValueSubject.asObservable().pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(inputValue => {
      if (!inputValue || inputValue.trim() === '') {
        return of([]); // Boş input üçün boş massiv
      }
      const url = `${this.baseUrl}?q=${encodeURIComponent(inputValue)}&key=${this.apiKey}&maxResults=8`;
      return this.http.get<any>(url).pipe( // API cavabı üçün daha dəqiq interfeys istifadə etmək daha yaxşıdır
        map(response => response.items && Array.isArray(response.items)
          ? response.items.map((data: any) => this.mapToBook(data))
          : []),
        catchError(error => {
          console.error('Error fetching searched books:', error);
          return of([]); // Xəta zamanı boş massiv
        })
      );
    })
  );

  constructor(private http: HttpClient) { }

  // Komponentdən axtarış dəyərini qəbul etmək üçün metod
  setSearchValue(value: string): void {
    this.searchedValueSubject.next(value);
  }

  // getBookById və getRandomBooks metodları əvvəlki kimi qala bilər (catchError ilə)

  getBookById(id: any): Observable<Book | null> {
    const url = `${this.baseUrl}/${id}?key=${this.apiKey}`;
    return this.http.get<any>(url).pipe(
      map(response => this.mapToBook(response)),
      catchError(error => {
        console.error(`Error fetching book with id ${id}:`, error);
        return of(null);
      })
    );
  }

  getRandomBooks(): Observable<Book[]> {
    const queryParams = 'q=filter=free-ebooks&full';
    const url = `${this.baseUrl}?${queryParams}&key=${this.apiKey}&maxResults=8`;
    return this.http.get<any>(url).pipe(
      map(response => response.items && Array.isArray(response.items)
        ? response.items.map((data: any) => this.mapToBook(data))
        : []),
      catchError(error => {
        console.error('Error fetching random books:', error);
        return of([]);
      })
    );
  }

  private mapToBook(data: any): Book {
    // ... (mapToBook metodunun içindəki məntiq)
    const volumeInfo = data.volumeInfo;
    return {
      id: data.id,
      title: volumeInfo?.title || 'Başlıq yoxdur',
      publisher: volumeInfo?.publisher,
      pageCaunt: volumeInfo?.pageCount, // `pageCaunt` deyil
      maturityRating: volumeInfo?.maturityRating,
      language: volumeInfo?.language,
      webReaderLink: data.accessInfo?.webReaderLink,
      imageLinks: volumeInfo?.imageLinks || { smallThumbnail: '', thumbnail: '' }
    };
  }
}