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

    private editMon = -1;
    private editMode = '';

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

    private toggleEditMode(id: number, prop: string): void {
        if (this.editMon !== id) {
            this.editMon = id;
            this.editMode = prop;
        } else {
            this.editMon = -1;
            this.editMode = '';
        }
    }

    private getImgSrc(imgType: string): string {
        if (imgType === 'awakened') {
            return this.monster.image_awakened;
        }
        if (imgType === 'base') {
            return this.monster.image_base;
        }
        return '';
    };

    // TODO: awill: readup on Angular CanDeactivate page: https://angular.io/api/router/CanDeactivate
    private goBack(): void {
        this.location.back();
    };

    private onDelete(mon: SummMon, evt: Event): void {
        evt.stopPropagation();

        if (confirm('Delete?') && confirm('Are you sure?')) {
            this.monsterService
                .delete(mon.id)
                .then(() => {
                    this.goBack();
                });
        }
    };

    private updateMonster(monUpdateToSend: SummMon): void {
        this.monsterService
            .update(monUpdateToSend)
            .then(updatedMon => {
                // NOTE: updated the local version
                this.monster = updatedMon;
                // NOTE: clear the edit field
                this.toggleEditMode(this.editMon, '');
            });
    };

    private getMonsterClasses(mon: SummMon): string[] {
        return [`mon-type-${mon.type}`];
    };
};
