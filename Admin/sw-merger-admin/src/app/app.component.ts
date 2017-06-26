import { Component } from '@angular/core';

export class SummMon {
    constructor() { }
    id: number;
    name: string;
    // isMissingRequiredProp: boolean;
    // isMissingProp: boolean;
    // missingFields: Array<string>;
    // type: string;
    // isLegend: boolean;
    // star: number;
    // image: string;
    // image_awakened: string;
    // level: number = 1;
    // hp: number = 0;
    // attack: number = 0;
    // defense: number = 0;
    // speed: number = 0;
    // crit_rate: number = 0;
    // crit_damage: number = 0;
    // resist: number = 0;
    // accuracy: number = 0;
    // _tsCreation: number = 0;
    // _tsSerialize: number = 0;
}

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
    // mon: SummMon = {
    //     id: 1,
    //     name: 'asdf'
    // };
}
