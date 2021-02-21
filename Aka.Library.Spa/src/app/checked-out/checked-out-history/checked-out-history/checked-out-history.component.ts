import { Component, HostBinding, OnInit, ViewChild } from '@angular/core';
import { SelectionModel } from "@angular/cdk/collections";
import { AuthService } from "../../../services/auth.service";
import { MemberService } from "../../../services/member.service";
import { ActivatedRoute, Router } from "@angular/router";
import { LibrariesService } from "../../../services/libraries.service";
import { BooksService } from "../../../services/books.service";
import { map, mergeAll } from "rxjs/operators";
import { SignedOutBook } from "../../../shared/signed-out-book";
import { forkJoin, zip } from "rxjs";
import { SignedOutBookDetails } from "../../../shared/signed-out-book-details";
import {MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import {slideInDownAnimation} from "../../../animations";

@Component({
  selector: 'app-checked-out-history',
  templateUrl: './checked-out-history.component.html',
  styleUrls: ['./checked-out-history.component.scss'],
  animations: [slideInDownAnimation]
})
export class CheckedOutHistoryComponent implements OnInit {
  @HostBinding('@routeAnimation') routeAnimation = true;
  @HostBinding('style.display')   display = 'block';
  @HostBinding('style.position')  position = 'initial';

  displayedColumns = ['id', 'library', 'title', 'dateCheckedOut', 'action'];
  dataSource = new MatTableDataSource();
  selection = new SelectionModel<Element>(true, []);

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private authService: AuthService,
    private memberService: MemberService,
    private router: Router,
    private route: ActivatedRoute,
    private libraryService: LibrariesService,
    private booksService: BooksService
  ) { }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit() {
    this.memberService.getMemberBookHistory(this.authService.currentMember).subscribe(res => console.log(res))
    this.memberService.getMemberBookHistory(this.authService.currentMember)
      .pipe(
        map((signedOutBooks: SignedOutBook []) => {
          const obss = signedOutBooks.map(signedOutBook => forkJoin([
            this.libraryService.getLibrary(signedOutBook.libraryId),
            this.booksService.getBook(signedOutBook.libraryId, signedOutBook.bookId)
          ])
            .pipe(
              map(([library, book]) => ({ ...signedOutBook, libraryName: library.name, bookName: book.title }))
            ));
          return zip(...obss);
        }),
        mergeAll()
      ).subscribe((signedOutBooksDetails: SignedOutBookDetails []) => {
      this.dataSource.data = signedOutBooksDetails;
    });
  }

  /**
   * Set the sort after the view init since this component will
   * be able to query its view for the initialized sort.
   */
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

}
