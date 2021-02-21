import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CheckedOutBooksComponent } from './checked-out-books/checked-out-books.component';
import {CheckedOutHistoryComponent} from "./checked-out-history/checked-out-history/checked-out-history.component";

const routes: Routes = [
  { path: '', component: CheckedOutBooksComponent },
  { path: 'history', component: CheckedOutHistoryComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckedOutRoutingModule { }
