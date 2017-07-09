import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/from';

import { SummMon } from '../models/monster';

@Injectable()
export class MonsterSearchService {
    public base_url:string = '';
    private servicePrefix = 'srv_monster-search | ';

    private getURLProm(): Promise<string> {
        return this.getURLObs()
            .toPromise()
            .then(newUrl => {
                return newUrl;
            });
    };

    private getURLObs(): Observable<string> {
        if (this.base_url !== '') {
            return Observable.of(this.base_url);
        }
        let testURL = 'http://127.0.0.1:5555';

        return this.http.get(testURL)
            .map(data => {
                this.base_url = data.json().base;

                return this.base_url;
            });
    };

    constructor(private http: Http) { }
    
    searchP(term: string): Promise<SummMon[]> {
        return this.getURLObs().toPromise()
                .then((newURL: string) => {
                    console.log(`Setting URL to: ${ newURL }`);
                    const searchUrl = `${ this.base_url }/monsters/search`;

                    console.log(`${ this.servicePrefix } searching at ${ searchUrl }`);
                    console.time(`${ this.servicePrefix }search`)

                    return this.http.get(`${ searchUrl }/?name=${ term }`).toPromise();
                })
                .then(resp => {
                    return resp.json().monsters as SummMon[];
                });
    };

    search(term: string): Observable<SummMon[]> {
        let proms = this.searchP(term);
        return Observable.from(proms);
    }

    private handleError(error: any): Promise<any> {
        console.error(`An error occurred: err=${ error } err.message=${ error.message }`);
        return Promise.reject(error.message || error);
    };
}
