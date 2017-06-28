import { Injectable } from '@angular/core';
import { SummMon } from './monster';
import { ALL_MONSTERS } from './mock-monsters';

@Injectable()
export class MonsterService {
    getMonsters(): Promise<SummMon[]> {
        return Promise.resolve(ALL_MONSTERS);
    };
};
