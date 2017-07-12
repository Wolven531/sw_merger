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
export class MonsterService {
    public base_url: string = '';
    private headers = new Headers({ 'Content-Type': 'application/json' });
    private servicePrefix = 'srv_monster | ';
    private scrollTypes = ['legendary', 'lightndark', 'mystical'];

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
        let testURL = 'http://127.0.0.1:5555';

        return this.http.get(testURL)
            .map(data => {
                this.base_url = data.json().base;

                return this.base_url;
            });
    };

    private validateSummonType(summType: string): boolean {
        return this.scrollTypes.indexOf(summType) > -1;
    };

    simulateSummon(summType: string): Promise<SummMon> {
        if(!this.validateSummonType(summType)) {
            return Promise.resolve<SummMon>(null);
        }

        return this.getURLObs().toPromise()
            .then(newURL => {
                console.log(`Setting URL to: ${ newURL }`);
                const simUrl = `${ newURL }/generator/${ summType }`;

                console.log(`${ this.servicePrefix } simulateSummon from ${ simUrl }`);
                console.time(`${ this.servicePrefix }simulateSummon`)
                return this.http.get(simUrl).toPromise();
            })
            .then(resp => {
                console.timeEnd(`${ this.servicePrefix }simulateSummon`);

                const respJSON = resp.json();
                const mon = respJSON.data && respJSON.data.monster;
                const err = respJSON.err;
                const newMon = mon as SummMon;

                if (!newMon.id) {
                    console.warn('[simulateSummon] Monster had no id; returning null');
                    return null;
                }
                if (err) {
                    console.warn(`[simulateSummon] There was an error, returning null err=${ err }`);
                    return null;
                }
                return newMon;
            })
            .catch(this.handleError);;
    };

    getMonsters(): Promise<SummMon[]> {
        return this.getURLObs().toPromise()
            .then(newURL => {
                console.log(`Setting URL to: ${ newURL }`);
                const allMonsUrl = `${ newURL }/monsters?output=id,name,type`;

                console.log(`${ this.servicePrefix } getMonsters from ${ allMonsUrl }`);
                console.time(`${ this.servicePrefix }getMonsters`)
                return this.http.get(allMonsUrl).toPromise();
            })
            .then(resp => {
                console.timeEnd(`${ this.servicePrefix }getMonsters`)
                const mons = resp.json().monsters;

                console.log(`${ this.servicePrefix } returning ${ mons.length } monsters...`);

                return mons as SummMon[];
            })
            .catch(this.handleError);
    };

    getMonster(id: number): Promise<SummMon> {
        return this.getURLObs().toPromise()
            .then(newURL => {
                console.log(`Setting URL to: ${ newURL }`);
                const singleMonUrl = `${ newURL }/monsters/${ id }`;

                console.log(`${ this.servicePrefix } getMonster`);
                console.time(`${ this.servicePrefix }getMonster`)

                return this.http.get(singleMonUrl).toPromise();
            })
            .then(resp => {
                console.timeEnd(`${ this.servicePrefix }getMonster`)
                const mons = resp.json().monsters;


                return resp.json().monster as SummMon;
            })
            .catch(this.handleError);
    };

    update(monster: SummMon): Promise<SummMon> {
        return this.getURLObs().toPromise()
            .then(newURL => {
                console.log(`Setting URL to: ${ newURL }`);
                const updateMonUrl = `${ newURL }/monsters/${ monster.id }`;
                const putOpts = { headers: this.headers };
                const monAsJson = JSON.stringify(monster);

                console.log(`${ this.servicePrefix } update`);
                console.time(`${ this.servicePrefix }update`)

                return this.http.put(updateMonUrl, monAsJson, putOpts).toPromise();
            })
            .then(resp => {
                console.timeEnd(`${ this.servicePrefix }update`)

                return monster;
            })
            .catch(this.handleError);
    };

    delete(id: number): Promise<void> {
        return this.getURLObs().toPromise()
            .then(newURL => {
                console.log(`Setting URL to: ${ newURL }`);
                const deleteMonUrl = `${ newURL }/monsters/${ id }`;

                console.log(`${ this.servicePrefix } delete`);
                console.time(`${ this.servicePrefix }delete`)

                return this.http.delete(deleteMonUrl).toPromise();
            })
            .then(resp => {
                console.timeEnd(`${ this.servicePrefix }delete`)

                return;
            })
            .catch(this.handleError);
    };

    private handleError(error: any): Promise<any> {
        console.error(`An error occurred: err=${ error } err.message=${ error.message }`);
        return Promise.reject(error.message || error);
    };
};
