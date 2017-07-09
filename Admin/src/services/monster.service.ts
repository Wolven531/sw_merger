import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import { SummMon } from '../models/monster';

@Injectable()
export class MonsterService {
    public base_url:string = 'http://127.0.0.1:5555';
    private headers = new Headers({ 'Content-Type': 'application/json' });
    private monstersUrl: string = `${ this.base_url }/monsters`;
    private monsterUrl: string = `${ this.base_url }/monsters`;

    constructor(private http: Http) {
        this.checkLocal();
    };
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
    getMonsters(): Promise<SummMon[]> {
        const allMonsUrl = `${ this.monstersUrl }?output=id,name,type`;
        return this.http.get(allMonsUrl)
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
