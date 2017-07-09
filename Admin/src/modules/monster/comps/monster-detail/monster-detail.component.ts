import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ParamMap } from '@angular/router';

import 'rxjs/add/operator/switchMap';

import { SummMon } from '../../../../models/monster';

import { MonsterService } from '../../../../services/monster.service';

@Component({
    selector: 'monster-detail',
    templateUrl: './monster-detail.component.html',
    styleUrls: ['./monster-detail.component.css'],
})
export class MonsterDetailComponent implements OnInit {
    @Input() private monster: SummMon;

    constructor(
        private monsterService: MonsterService,
        private route: ActivatedRoute,
        private location: Location){ };

    ngOnInit(): void {
        this.route.paramMap
            .switchMap((params: ParamMap) => {
                const id = parseInt(params.get('id'), 10);

                return this.monsterService.getMonster(id);
            })
            .subscribe(monster => {
                this.monster = monster;
            });
    };

    // TODO: awill: readup on Angular CanDeactivate page: https://angular.io/api/router/CanDeactivate
    goBack(): void {
        this.location.back();
    };

    onDelete(mon: SummMon, evt: Event): void {
        evt.stopPropagation();

        if (confirm('Delete?') && confirm('Are you sure?')) {
            this.delete(mon);
        }
    };

    save(): void {
        this.monsterService
            .update(this.monster)
            .then(() => {
                this.goBack();
            });
    };

    delete(mon: SummMon): void {
        this.monsterService
            .delete(mon.id)
            .then(() => {
                this.goBack();
            });
    };
};
