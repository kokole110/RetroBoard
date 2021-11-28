import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BoardsComponent } from './boards/boards.component';
import { BoardAddComponent } from './boards/board-add/board-add.component';
//import { BoardStartComponent } from './boards/board-start/board-start.component';
import { BoardDetailComponent } from './boards/board-detail/board-detail.component';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth-guard';

const routes: Routes = [
  { path: '', redirectTo: '/auth', pathMatch: 'full'},
  { path: 'boards', component: BoardsComponent },
  { path: 'boards/new', component: BoardAddComponent },
  { path: 'boards/:id', component: BoardDetailComponent },
  { path: 'auth', component: AuthComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}