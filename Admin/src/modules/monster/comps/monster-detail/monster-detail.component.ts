'use strict';

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
    selector: 'app-monster-detail',
    templateUrl: './monster-detail.component.html',
    styleUrls: ['./monster-detail.component.css'],
})
export class MonsterDetailComponent implements OnInit {
    @Input() monster: SummMon;

    constructor(
        private monsterService: MonsterService,
        private route: ActivatedRoute,
        private location: Location) { };

    ngOnInit(): void {
        // NOTE: this component is being supplied with a monster already
        if (this.monster) {
            return;
        }
        this.route.paramMap
            .switchMap((params: ParamMap) => {
                const id = parseInt(params.get('id'), 10);

                return this.monsterService.getMonster(id);
            })
            .subscribe((monster: SummMon) => {
                this.monster = monster;
            });
    };

    getImgSrc(imgType: string): string {
        if (imgType === 'awakened') {
            return this.monster.image_awakened;
        }
        if (imgType === 'base') {
            return this.monster.image_base;
        }
        return '';
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
        alert('Changes currently will not persist after server restart');
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
