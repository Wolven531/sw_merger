import { Injectable } from '@angular/core';
import { SummMon } from './monster';
import { ALL_MONSTERS } from './mock-monsters';

@Injectable()
export class MonsterService {
    getMonsters(): Promise<SummMon[]> {
        return Promise.resolve(ALL_MONSTERS);
    };
    getMonster(id: number): Promise<SummMon> {
        return this.getMonsters().then(monsters => {
           return monsters.find(monster => {
               return monster.id === id;
           });
        });
    };
};
