import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';

import { SummMon } from '../models/monster';

@Injectable()
export class MonsterSearchService {
    public base_url:string = 'http://127.0.0.1:5555';
    private searchUrl: string = `${ this.base_url }/monsters/search`;

    constructor(private http: Http) {
        this.checkLocal();
    }
    checkLocal(): Promise<void> {
        return this.http.get(this.base_url)
            .toPromise()
            .then(resp => {
                if (resp.status !== 200) {
                    alert('API is not running locally. To start it, run start.sh in the API directory.');
                    return;
                }
                this.base_url = resp.json().base;
            })
            .catch(err => {
                alert('API is not running locally. To start it, run start.sh in the API directory.');
            });
    };
    search(term: string): Observable<SummMon[]> {
        return this.http
            .get(`${ this.searchUrl }/?name=${ term }`)
            .map(resp => {
                return resp.json().monsters as SummMon[];
            });
    }
}
