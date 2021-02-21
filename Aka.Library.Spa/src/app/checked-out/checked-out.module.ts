import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckedOutBooksComponent } from './checked-out-books/checked-out-books.component';
import { LibraryMatModule } from '../library-mat.module';
import { CheckedOutRoutingModule } from './checked-out-routing.module';
import { CheckedOutHistoryComponent } from './checked-out-history/checked-out-history/checked-out-history.component';

@NgModule({
  declarations: [
    CheckedOutBooksComponent,
    CheckedOutHistoryComponent
  ],
  exports: [
    CheckedOutBooksComponent,
    CheckedOutHistoryComponent
  ],
  imports: [
    CommonModule,
    CheckedOutRoutingModule,
    LibraryMatModule
  ]
})
export class CheckedOutModule { }
