import { environment } from '../../environments/environment';
import { LibraryBook } from '../shared/library-book';
import { Book } from '../shared/book';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SignedOutBook } from '../shared/signed-out-book';
import { map } from 'lodash';
import { GoogleBooksMetadata } from '../shared/google-books-metadata';
import { Observable } from 'rxjs/internal/Observable';
import { throwError } from 'rxjs/internal/observable/throwError';
import { of } from 'rxjs/internal/observable/of';
import {forkJoin, Subject} from "rxjs";
import {take, tap} from "rxjs/operators";

@Injectable()
export class BooksService {

  apiUrl: string;
  googleBooksAPIKey: string;

  constructor(private http: HttpClient) {
    this.apiUrl = `${environment.apiUrl}${environment.apiPath}/libraries/`;
    this.googleBooksAPIKey = 'AIzaSyCCN_lQcnEQ51ohoDBroFvfwN8wnJi9iPY';
  }

  getBooks(libraryId: number): Observable<Book[]> {
    const url = `${this.apiUrl}${libraryId}/books`;
    return this.http.get<Book[]>(url);
  }

  getLibraryInventory(libraryId: number): Observable<LibraryBook[]> {
    const url = `${this.apiUrl}${libraryId}/books`;
    return this.http.get<LibraryBook[]>(url);
  }

  getBook(libraryId: number, bid: number): Observable<Book> {
    const url = `${this.apiUrl}${libraryId}/books/${bid}`;
    return this.http.get<Book>(url);
  }

  getAvailableBooks(libraryId: number): Observable<Book[]> {
    const url = `${this.apiUrl}${libraryId}/books/available`;
    return this.http.get<Book[]>(url);
  }

  getCheckedOutBooks(libraryId: number): Observable<Book[]> {
    const url = `${this.apiUrl}${libraryId}/books/checkedout`;
    return this.http.get<Book[]>(url);
  }

  /**
   * For a given library and given book return the total number of copies for the book
   *
   * @param {number} libraryId Library to look for book
   * @param {number} bookId Book to find
   * @returns {Observable<number>} Count of books
   * @memberof BooksService
   */
  getTotalNumberOfCopiesInLibrary(libraryId: number, bookId: number): Observable<number> {
    // TODO: Add implementation
    const inventory = this.getLibraryInventory(libraryId);
    const totalCopies = new Subject<number>();
    inventory.subscribe(inven => {
      totalCopies.next(inven.find(i => i.book.bookId === bookId).totalPurchasedByLibrary);
    });

    return totalCopies.asObservable();
  }

  /**
   * This function should calculate the number of available copies of a book within a library given a libraryId and a bookId
   * using the api
   *
   * @param {number} libraryId
   * @param {number} bookId
   * @returns {Observable<number>}
   * @memberof BooksService
   */
  getNumberOfAvailableBookCopies(libraryId: number, bookId: number): Observable<number> {
    const availableCopies = new Subject<number>();
    forkJoin([
      this.getCheckedOutBooks(libraryId),
      this.getTotalNumberOfCopiesInLibrary(libraryId, bookId)
    ]).subscribe(([checkedOutBooks, totalCopies]) => {
      availableCopies.next(totalCopies - checkedOutBooks.filter(book => book.bookId === bookId).length);
    });
    return availableCopies.asObservable();
  }

  checkOutBook(libraryId: number, bookId: number, memberId: number): Observable<SignedOutBook> {
    const url = `${this.apiUrl}${libraryId}/books/${bookId}/signout/${memberId}`;
    return this.http.post<SignedOutBook>(url, {});
  }

  returnBook(libraryId: number, bookId: number, memberId: number): Observable<SignedOutBook> {
    const url = `${this.apiUrl}${libraryId}/books/${bookId}/return/${memberId}`;
    return this.http.put<SignedOutBook>(url, {});
  }

  /**
   * Gets all the meta information for the book
   * The google api reference to get meta data https://developers.google.com/books/docs/v1/using
   *
   * @param {string} isbn
   * @returns {Observable<GoogleBooksMetadata>}
   * @memberof BooksService
   */
  getBookMetaData(isbn: string): Observable<GoogleBooksMetadata> {
    // TODO: Add implementation
    const formattedIsbn = (!!isbn) ? isbn.replace(/[^0-9]+/, '') : isbn;
    const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${formattedIsbn}&key=${this.googleBooksAPIKey}`;
    const metaData = new Subject<GoogleBooksMetadata>();
    this.http.get(url).subscribe((result: any) => {
      const data: GoogleBooksMetadata = {
        description: result.items[0].volumeInfo.description,
        authors: result.items[0].volumeInfo.authors,
        imageLinks: {
          thumbnail: result.items[0].volumeInfo.imageLinks.thumbnail,
          smallThumbnail: result.items[0].volumeInfo.imageLinks.smallThumbnail
        }
      };
      metaData.next(data);
    });
    return metaData.asObservable();

  }

}
