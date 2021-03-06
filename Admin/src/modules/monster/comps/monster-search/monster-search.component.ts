'use strict';

import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

// Observable class extensions
import 'rxjs/add/observable/of';

// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { SummMon } from '../../../../models/monster';
import { MonsterSearchService } from '../../../../services/monster-search.service';

@Component({
    selector: 'app-monster-search',
    templateUrl: './monster-search.component.html',
    styleUrls: ['./monster-search.component.css'],
    providers: [MonsterSearchService],
})
export class MonsterSearchComponent implements OnInit {
    private monsters: Observable<SummMon[]>;
    private searchName = new Subject<string>();

    constructor(
        private monsterSearchService: MonsterSearchService,
        private router: Router) {
    };

    // NOTE: Push a search term into the observable stream
    search(term: string): void {
        this.searchName.next(term);
    };

    ngOnInit(): void {
        this.monsters = this.searchName
            // NOTE: wait 300ms after each keystroke before considering the term
            .debounceTime(300)
            // NOTE: ignore if next search term is same as previous
            .distinctUntilChanged()
            // NOTE: switch to new observable each time the term changes
            .switchMap((term: string) => {
                if (term && (term.length > 2)) {
                    // NOTE: return the http search observable
                    return this.monsterSearchService.searchByName(term);
                }
                // NOTE: or an observable of an empty collection if there was no search term
                return Observable.of<SummMon[]>([]);
            })
            .catch(error => {
                // TODO: add real error handling
                console.error(error);
                return Observable.of<SummMon[]>([]);
            });
    };

    gotoDetail(monster: SummMon): void {
        const link = ['/monster/detail', monster.id];
        this.router.navigate(link);
    };

    getMonsterClasses(mon: SummMon): string[] {
        return [`mon-type-${mon.type}`];
    };
}
