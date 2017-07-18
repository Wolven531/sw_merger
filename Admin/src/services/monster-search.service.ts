'use strict';

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/from';

import { SummMon } from '../models/monster';

@Injectable()
export class MonsterSearchService {
    public base_url = '';
    private servicePrefix = 'srv_monster-search | ';

    constructor(private http: Http) { }

    public searchByName(term: string): Observable<SummMon[]> {
        // NOTE: awill: courtesy of https://stackoverflow.com/questions/39319279/convert-promise-to-observable
        return Observable.from(
            this.getURLObs().toPromise()
                .then((newURL: string) => {
                    console.info(`Setting URL to: ${newURL}`);
                    const searchUrl = `${this.base_url}/monsters/search`;

                    console.info(`${this.servicePrefix} searching at ${searchUrl}`);
                    console.time(`${this.servicePrefix}search`);

                    return this.http.get(`${searchUrl}/?name=${term}`).toPromise();
                })
                .then(resp => {
                    console.timeEnd(`${this.servicePrefix}search`);
                    return resp.json().monsters as SummMon[];
                })
        );
    };

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
        const testURL = 'http://127.0.0.1:5555';

        return this.http.get(testURL)
            .map(data => {
                this.base_url = data.json().base;

                return this.base_url;
            });
    };

    private handleError(error: any): Promise<any> {
        console.error(`An error occurred: err=${error} err.message=${error.message}`);
        return Promise.reject(error.message || error);
    };
}
