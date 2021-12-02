import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideDatabase,getDatabase } from '@angular/fire/database';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { ColorPickerModule } from 'ngx-color-picker';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { BoardsComponent } from './boards/boards.component';
import { HeaderComponent } from './header/header.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { BoardItemComponent } from './boards/board-item/board-item.component';
import { BoardDetailComponent } from './boards/board-detail/board-detail.component';
import { BoardColumnComponent } from './boards/board-column/board-column.component';
import { BoardCardComponent } from './boards/board-card/board-card.component';
import { BoardAddComponent } from './boards/board-add/board-add.component';
import { BoardCommentComponent } from './boards/board-comment/board-comment.component';


@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    BoardsComponent,
    HeaderComponent,
    LoadingSpinnerComponent,
    BoardItemComponent,
    BoardDetailComponent,
    BoardColumnComponent,
    BoardCardComponent,
    BoardAddComponent,
    BoardCommentComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ColorPickerModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    provideFirestore(() => getFirestore()),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
