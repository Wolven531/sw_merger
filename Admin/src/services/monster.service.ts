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
                const mons = resp.json().monsters;

                console.log(`${ this.servicePrefix } returning ${ mons.length } monsters...`);
                console.timeEnd(`${ this.servicePrefix }getMonsters`)
    
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
                const mons = resp.json().monsters;

                console.timeEnd(`${ this.servicePrefix }getMonster`)

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
                console.timeEnd(`${ this.servicePrefix }update`)

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
                console.timeEnd(`${ this.servicePrefix }delete`)

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
