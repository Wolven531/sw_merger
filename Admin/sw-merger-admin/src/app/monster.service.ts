import { Headers } from '@angular/http';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/toPromise';
import { SummMon } from './monster';

@Injectable()
export class MonsterService {
    private headers = new Headers({ 'Content-Type': 'application/json' });
    private baseUrl = 'https://edfe9bd1.ngrok.io';
    private monstersUrl: string = `${ this.baseUrl }/monsters`;
    private monsterUrl: string = `${ this.baseUrl }/monsters`;

    constructor(private http: Http) {
    };
    getMonsters(): Promise<SummMon[]> {
        return this.http.get(this.monstersUrl)
             .toPromise()
             .then(resp => {
                 return resp.json().monsters as SummMon[];
             })
             .catch(this.handleError);
    };
    getMonster(id: number): Promise<SummMon> {
        const singleMonUrl = `${ this.monsterUrl }/${ id }`;

        return this.http.get(singleMonUrl)
            .toPromise()
            .then(resp => {
                return resp.json().monster as SummMon;
            })
            .catch(this.handleError);
    };
    update(monster: SummMon): Promise<SummMon> {
        const updateMonUrl = `${ this.monsterUrl }/${ monster.id }`;
        const putOpts = { headers: this.headers };
        const monAsJson = JSON.stringify(monster);

        return this.http.put(updateMonUrl, monAsJson, putOpts)
            .toPromise()
            .then(() => {
                return monster;
            })
            .catch(this.handleError);
    };
    delete(id: number): Promise<void> {
        const deleteMonUrl = `${ this.monsterUrl }/${ id }`;

        return this.http.delete(deleteMonUrl)
            .toPromise()
            .then(resp => {
                return;
            })
            .catch(this.handleError);
    };

    private handleError(error: any): Promise<any> {
        console.error(`An error occurred: err=${ error } err.message=${ error.message }`);
        return Promise.reject(error.message || error);
    };
};
