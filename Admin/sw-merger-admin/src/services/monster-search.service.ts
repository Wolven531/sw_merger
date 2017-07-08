import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { SummMon } from '../models/monster';
import { MonsterService } from './monster.service';

@Injectable()
export class MonsterSearchService {
    private headers = new Headers({ 'Content-Type': 'application/json' });
    private searchUrl: string = `${ MonsterService.BASE_URL }/monsters/search`;

    constructor(private http: Http) { }

    search(term: string): Observable<SummMon[]> {
        return this.http
            .get(`${ this.searchUrl }/?name=${ term }`)
            .map(resp => {
                return resp.json().monsters as SummMon[];
            });
    }
}
