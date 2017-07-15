'use strict';

import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Http } from '@angular/http';
import { async } from 'async';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { SummMon } from '../models/monster';

@Injectable()
export class CrawlerService {
    public base_url = '';
    private headers = new Headers({ 'Content-Type': 'application/json' });
    private servicePrefix = 'srv_crawler | ';

    constructor(private http: Http) { };

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
};
