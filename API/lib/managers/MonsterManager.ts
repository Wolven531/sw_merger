'use strict';

import * as fs from 'file-system';
import * as path from 'path';

import { SummMon } from '../../models/monster';

export default class MonsterManager {
    private internalMap: any = {};
    private compName = '[MonsterManager]';

    constructor() {
        console.info(`${this.compName} [constructor] Constructing monster manager...`);
        this.internalMap = this.loadFromDisk();
    }

    public init(): void {
        // console.info(`${ this.compName } [init] Initializing monster manager...`);
        // this.internalMap = this.loadFromDisk();
    };

    public searchMonsters(searchOpts: any = null): SummMon[] {
        const results = [];
        if (!searchOpts) {
            return results;
        }
        let searchName = String(searchOpts.name || '');
        let searchType = String(searchOpts.type || '');
        // TODO: awill: move these filters out (so we do not create them on every search)
        const typeFilter = (mon, ind, arr) => {
            return mon.type === searchType;
        };
        const nameFilter = (mon: SummMon, ind: number, arr): boolean => {
            if (searchName.length <= mon.name.length) {
                const lowerFullName = mon.name.toLowerCase();
                const lowerSearchName = searchName.toLowerCase();
                const locInd = lowerFullName.indexOf(lowerSearchName);

                return locInd > -1;
            }
            return false;
        };
        const useType = (searchType.length > 0) && SummMon.MONSTER_ELEMENT.validate(searchType);
        const useName = searchName.length > 0;
        const nameContainsType = this.containsType(searchName);

        if ((useType && useName) || (useName && nameContainsType)) {
            console.info(
                `[MonsterManager] [searchMonsters] Considering `
                + `nameContainsType=${nameContainsType} searchType=${searchType} AND searchName=${searchName}`
            );
            if (nameContainsType) {
                const typesInName = this.getTypesInName(searchName);
                searchName = this.removeTypesFromName(searchName);

                if (typesInName.length > 0) {
                    searchType = typesInName[0];
                }
                console.info(`[MonsterManager] [searchMonsters] UPDATE Considering searchType=${searchType} AND searchName=${searchName}`);
            }

            this.getMonsterArray()
                .filter(typeFilter)
                .filter(nameFilter)
                .forEach((mon, ind, arr) => {
                    results.push(mon);
                });
            console.log(`[MonsterManager] [searchMonsters] Returning search results: ${results.length}`);
            return results;
        }

        if (useType) {
            console.info(`[MonsterManager] [searchMonsters] Considering type with searchType=${searchType}`);
            this.getMonsterArray()
                .filter(typeFilter)
                .forEach((mon, ind, arr) => {
                    results.push(mon);
                });
        }

        if (useName) {
            console.info(`[MonsterManager] [searchMonsters] Considering name with searchName=${searchName}`);
            this.getMonsterArray()
                .filter(nameFilter)
                .forEach((mon, ind, arr) => {
                    results.push(mon);
                });
        }

        console.log(`[MonsterManager] [searchMonsters] Returning search results: ${results.length}`);
        return results;
    };

    public getMonster(monId: number): SummMon {
        if (!monId) {
            return null;
        }

        return this.internalMap[String(monId)];
    };

    public addMonster(newMon: SummMon): SummMon {
        // TODO: awill: add proper validation of monster here before adding

        if (String(newMon.id).length < 1) {
            console.warn(`Could not add monster, no ID in monster. newMon.id=${newMon.id} newMon=${newMon}`);
            return null;
        }
        const existingMon = this.getMonster(newMon.id);

        if (existingMon) {
            console.warn(
                `Attempted to add monster that already exists,`
                + ` using update instead (id=${existingMon.id}, name=${existingMon.name}).`
            );
            return this.updateMonster(newMon.id, newMon);
        }

        this.internalMap[newMon.id] = newMon;

        return this.internalMap[newMon.id];
    };

    public removeMonster(monId: number): SummMon {
        if (!monId) {
            console.warn('Could not remove monster, no ID provided.');
            return null;
        }

        const targetMon = this.getMonster(monId);

        if (!targetMon) {
            console.warn(`Could not remove monster because it could not be found (id=${monId}).`);
            return null;
        }

        delete this.internalMap[String(monId)];
        return targetMon;
    };

    public updateMonster(monId: number, monster: SummMon = null): SummMon {
        if (!monId) {
            console.warn('Could not update monster, no ID provided.');
            return null;
        }
        if (!monster) {
            console.warn('Could not remove monster, no monster provided.');
            return null;
        }

        const existingMon = this.getMonster(monId);
        const monKey = String(monId);

        // NOTE: this forces any monster that did not already exist to fail an update attempt
        if (!existingMon) {
            console.warn(`Could not update monster because it could not be found (id=${monId}).`);
            return null;
        }
        this.internalMap[monKey] = monster;

        return this.internalMap[monKey];
    };

    public getMonsterArray(): SummMon[] {
        console.info(`${this.compName} [getMonsterArray]`);
        const results = new Array<SummMon>();
        const keys = Object.keys(this.internalMap || {});

        // NOTE: each validation case is handled separately for explicity
        if (!this.internalMap) {
            return results;
        }
        if (keys.length < 1) {
            return results;
        }

        for (let i = 0; i < keys.length; i++) {
            results.push(this.internalMap[keys[i]]);
        }
        return results;
    };

    private containsType(tester: string): boolean {
        const matchingTypes = this.getTypesInName(tester);
        return matchingTypes.length > 0;
    };

    private removeTypesFromName(tester: string): string {
        const typesInName = this.getTypesInName(tester);
        typesInName.forEach((curr, ind, arr) => {
            const startInd = tester.indexOf(curr);
            const endInd = startInd + curr.length;
            tester = tester.substring(0, startInd) + tester.substring(endInd);
        });
        tester = tester.trim();
        return tester;
    };

    private getTypesInName(tester: string): any[] {
        let matchingTypes = [];

        tester = String(tester || '').trim().toLowerCase();
        // NOTE: shortest type is four chars
        if (tester.length < 4) {
            return matchingTypes;
        }
        matchingTypes = SummMon.MONSTER_ELEMENT.asArray().filter((curr, ind, arr) => {
            return tester.indexOf(curr) > -1;
        });
        return matchingTypes;
    };

    private getMonsterMap(forceRefresh: boolean): any {
        console.info(`${this.compName} [getMonsterMap] params: forceRefresh=${forceRefresh}`);
        // NOTE: this adds explicit type safety for the optional param
        forceRefresh = forceRefresh ? true : false;
        if (forceRefresh) {
            this.internalMap = this.loadFromDisk();
        }
        return this.internalMap;
    };

    private loadFromDisk(): any {
        console.info(`${this.compName} [loadFromDisk] About to load from disk...`);
        const elems = SummMon.MONSTER_ELEMENT.asArray();
        // let mons = [];
        const monMap = {};
        let fp = '';
        let monCount = 0;

        elems.forEach((t, ind, arr) => {
            let filename = '';
            let mapKey = '';
            let monData = null;
            let newMon = null;
            const dataDir = path.resolve(`${__dirname}${path.sep}..${path.sep}..${path.sep}..${path.sep}data${path.sep}${t}${path.sep}`);

            fp = dataDir;

            if (!fs.fs.existsSync(fp)) {
                console.warn(`Data dir was missing: ${fp} | __dirname = ${__dirname}`);
                return;
            }

            const jsonFiles = fs.fs.readdirSync(fp).filter((currFileName, jsonInd, jsonArr) => {
                // const jsonFiles = fs.fs.readdirSync(fp, { encoding: 'utf8' }).filter((currFileName, ind, arr) => {
                return path.extname(currFileName) === '.json';
            });

            console.info(`Dir ${fp} had ${jsonFiles.length} files`);
            for (let i = 0; i < jsonFiles.length; i++) {
                filename = jsonFiles[i];
                fp = path.resolve(`${dataDir}${path.sep}${filename}`);

                console.info(`About to read file, fp = ${fp}`);
                monData = fs.fs.readFileSync(fp, { encoding: 'utf8', flag: 'r' });

                newMon = new SummMon(monData);
                mapKey = String(newMon.id);

                monMap[mapKey] = newMon;
                monCount++;
            }
        });
        console.info(`Total mon count: ${monCount}`);

        return monMap;
    };
};

export { MonsterManager as MonsterManager };
