import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { BookDetailComponent } from './book-detail/book-detail.component';
import { HeadLineComponent } from './head-line/head-line.component';

@NgModule({
  declarations: [
    AppComponent,

    MainComponent,
    BookDetailComponent,
    HeadLineComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
