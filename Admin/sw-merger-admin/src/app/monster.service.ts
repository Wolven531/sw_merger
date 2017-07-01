import { Headers } from '@angular/http';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/toPromise';
import { SummMon } from './monster';

@Injectable()
export class MonsterService {
    private monstersUrl: string = 'https://72b45a0a.ngrok.io/monsters';

    constructor(private http: Http) {
        console.log('Monster service constructor was called.');
    };
    getMonsters(): Promise<SummMon[]> {
        console.log('getMonsters was called...');
        return this.http.get(this.monstersUrl)
             .toPromise()
             .then(resp => {
                 return resp.json().monsters as SummMon[];
             })
             .catch(this.handleError);
    };
    getMonster(id: number): Promise<SummMon> {
        return this.getMonsters().then(monsters => {
           return monsters.find(monster => {
               return monster.id === id;
           });
        });
    };
    private handleError(error: any): Promise<any> {
        console.error(`An error occurred: err=${ error } err.message=${ error.message }`);
        return Promise.reject(error.message || error);
    };
};
