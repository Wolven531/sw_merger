import { Component, Input } from '@angular/core';
import { SummMon } from './monster';

@Component({
    selector: 'monster-detail',
    templateUrl: './monster-detail.component.html',
    styleUrls: ['./monster-detail.component.css'],
})
export class MonsterDetailComponent {
    @Input() monster: SummMon;
};
