import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';// NOTE: NgModel lives here
import { AppComponent } from './app.component';
import { MonsterDetailComponent } from './monster-detail.component';

@NgModule({
    declarations: [
        AppComponent,
        MonsterDetailComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {

};
