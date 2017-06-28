import { Component } from '@angular/core';
import { SummMon } from './monster';

const ALL_MONSTERS: SummMon[] = [
    {
        id: 1,
        name: 'qwer'
    },
    {
        id: 2,
        name: 'asdf'
    },
    {
        id: 3,
        name: 'zxcv'
    }
];

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'SW-Merger Admin Tool';
    monsters = ALL_MONSTERS;
    selectedMon: SummMon;
    onSelect(mon: SummMon): void {
        this.selectedMon = mon;
    };
    // mon: SummMon = {
    //     id: 1,
    //     name: 'asdf'
    // };
};
