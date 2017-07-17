'use strict';

import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Http } from '@angular/http';
import { async } from 'async';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { Crawler } from '../models/crawler';
import { SummMon } from '../models/monster';

@Injectable()
export class CrawlerService {
    public base_url = '';
    private headers = new Headers({ 'Content-Type': 'application/json' });
    private servicePrefix = 'srv_crawler | ';

    constructor(private http: Http) { };

    public runCrawler(id: number): Promise<any> {
        const postOpts = { headers: this.headers };

        return this.getURLObs().toPromise()
            .then(newURL => {
                const runCrawlerUrl = `${newURL}/crawler/run/${id}`;
                console.log(`Setting URL to: ${runCrawlerUrl}`);

                console.log(`${this.servicePrefix} run crawler from ${runCrawlerUrl}`);
                console.time(`${this.servicePrefix}runCrawler`)
                return this.http.post(runCrawlerUrl, postOpts).toPromise();
            })
            .then(resp => {
                console.timeEnd(`${this.servicePrefix}runCrawler`)
                const resultJson = resp.json();

                return resultJson;
            })
            .catch(this.handleError);
    };

    public updateCrawler(updatedCrawler: Crawler): Promise<Crawler> {
        const updatedCrawlerAsJSON = JSON.stringify(updatedCrawler);
        const putOpts = { headers: this.headers };

        return this.getURLObs().toPromise()
            .then(newURL => {
                const updateCrawlerUrl = `${newURL}/crawler/${ updatedCrawler.id }`;
                console.log(`Setting URL to: ${updateCrawlerUrl}`);

                console.log(`${this.servicePrefix} updated crawler from ${updateCrawlerUrl}`);
                console.time(`${this.servicePrefix}updateCrawler`)
                return this.http.put(updateCrawlerUrl, updatedCrawlerAsJSON, putOpts).toPromise();
            })
            .then(resp => {
                console.timeEnd(`${this.servicePrefix}updateCrawler`)
                const respAsJson = resp.json();
                const crawler = respAsJson.updatedCrawler;

                return crawler as Crawler;
            })
            .catch(this.handleError);
    };

    public addCrawler(newCrawler: Crawler): Promise<Crawler> {
        const newCrawlerAsJSON = JSON.stringify(newCrawler);
        const postOpts = { headers: this.headers };

        return this.getURLObs().toPromise()
            .then(newURL => {
                const addCrawlerUrl = `${newURL}/crawler/`;
                console.log(`Setting URL to: ${addCrawlerUrl}`);

                console.log(`${this.servicePrefix} add crawler from ${addCrawlerUrl}`);
                console.time(`${this.servicePrefix}addCrawler`)
                return this.http.post(addCrawlerUrl, newCrawlerAsJSON, postOpts).toPromise();
            })
            .then(resp => {
                console.timeEnd(`${this.servicePrefix}addCrawler`)
                const crawler = resp.json().crawler;

                return crawler as Crawler;
            })
            .catch(this.handleError);
    };

    public removeCrawler(id: number): Promise<void> {
        return this.getURLObs().toPromise()
            .then(newURL => {
                const removeUrl = `${newURL}/crawler/${id}`;
                console.log(`Setting URL to: ${removeUrl}`);

                console.log(`${this.servicePrefix} delete`);
                console.time(`${this.servicePrefix}delete`)

                return this.http.delete(removeUrl).toPromise();
            })
            .then(resp => {
                console.timeEnd(`${this.servicePrefix}delete`)

                return;
            })
            .catch(this.handleError);
    };

    public getCrawlers(): Promise<Crawler[]> {
        return this.getURLObs().toPromise()
            .then(newURL => {
                const allCrawlersUrl = `${newURL}/crawler/`;
                console.log(`Setting URL to: ${allCrawlersUrl}`);

                console.log(`${this.servicePrefix} get crawlers from ${allCrawlersUrl}`);
                console.time(`${this.servicePrefix}getCrawlers`)
                return this.http.get(allCrawlersUrl).toPromise();
            })
            .then(resp => {
                console.timeEnd(`${this.servicePrefix}getCrawlers`)
                const crawlers = resp.json().crawlers;

                console.log(`${this.servicePrefix} returning ${crawlers.length} crawlers...`);

                return crawlers as Crawler[];
            })
            .catch(this.handleError);
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
};
