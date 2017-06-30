import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';// NOTE: NgModel lives here
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from './dashboard.component';
import { MonsterDetailComponent } from './monster-detail.component';
import { MonstersComponent } from './monsters.component';
import { MonsterService } from './monster.service';

@NgModule({
    declarations: [
        AppComponent,
        DashboardComponent,
        MonsterDetailComponent,
        MonstersComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
    ],
    providers: [MonsterService],
    bootstrap: [AppComponent],
})
export class AppModule {

};
