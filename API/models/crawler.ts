'use strict';

import * as fs from 'fs';
import * as moment from 'moment';
import * as path from 'path';
export default class Crawler {
    public id: number;
    public _tsCreation: number;
    public _tsSerialize: number;

    public name: string;

    /*
        @summary This is the constructor for the Crawler model
        @constructor
        @param data object - The map/object to use to populate this model
        @param opts object - See properties below
    */
    constructor(private data: any = null, private opts: any = null) {
        if (!opts) {
            opts = {
                memOnly: true,
            };
        }

        if (!data) {
            console.warn(`[${ this.getModelName() }] [constructor] data was missing or null`);
            return;
        }
        if (typeof data === 'string') {
            data = JSON.parse(data);
        }

        // NOTE: for now carry forward the serialize time
        if (data.hasOwnProperty('_tsSerialize')) {
            this._tsSerialize = data._tsSerialize;
        }

        this._tsCreation = moment.utc().valueOf();
    }

    /*
        @summary This method is used to ensure each model has a unique name (maintenance)
        @return string
    */
    public getModelName(): string {
        return 'Crawler';
    };

    /*
        @summary This method converts this model into a string (for persistence)
        @return string - The JSON-safe string version of this model
    */
    public serialize(): string {
        let returnVal = {};
        returnVal['id'] = this.id;
        returnVal['name'] = this.name;

        returnVal['_tsCreation'] = this._tsCreation;
        returnVal['_tsSerialize'] = moment.utc();

        return JSON.stringify(returnVal);
    };

    /*
        @toString
    */
    public toString(): string {
        return `[${ this.getModelName() }]
            _tsCreation: ${ this._tsCreation }
            _tsSerialize: ${ this._tsSerialize }
            id: ${ this.id }
            name: ${ this.name }`;
    };
};

export { Crawler as Crawler };
