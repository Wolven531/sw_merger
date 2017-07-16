'use strict';

import * as fs from 'fs';
import * as moment from 'moment';
import * as path from 'path';
export default class Crawler {
    private static counter = 0;

    /*
        @summary This method is used to ensure each model has a unique name (maintenance)
        @return string
    */
    public static getModelName(): string {
        return 'Crawler';
    };

    public _tsCreation: number;
    public _tsSerialize: number;
    public id: number;

    public name: string;
    public url: string;
    public domSelector: string;

    /*
        @summary This is the constructor for the Crawler model
        @constructor
        @param data object - The map/object to use to populate this model
        @param opts object - See properties below
    */
    constructor(private data: any = null, private opts: any = null) {
        if (!opts) {
            opts = { };
        }

        if (!data) {
            console.warn(`[${Crawler.getModelName()}] [constructor] data was missing or null`);
            return;
        }
        if (typeof data === 'string') {
            data = JSON.parse(data);
        }

        // NOTE: for now carry forward the serialize time
        if (data.hasOwnProperty('_tsSerialize')) {
            this._tsSerialize = data._tsSerialize;
        }

        this.id = Crawler.counter;
        this._tsCreation = moment.utc().valueOf();
        this.name = String(data.name);
        this.url = String(data.url);
        this.domSelector = String(data.domSelector);

        Crawler.counter++;
    }

    /*
        @summary This method converts this model into a string (for persistence)
        @return string - The JSON-safe string version of this model
    */
    public serialize(): string {
        const returnVal = {
            id: this.id,
            name: this.name,
            url: this.url,
            domSelector: this.domSelector,
            _tsCreation: this._tsCreation,
            _tsSerialize: moment.utc().valueOf()
        };

        return JSON.stringify(returnVal);
    };

    /*
        @toString
    */
    public toString(): string {
        return `[${Crawler.getModelName()}]
            _tsCreation: ${ this._tsCreation}
            _tsSerialize: ${ this._tsSerialize}
            id: ${ this.id}
            name: ${ this.name}
            url: ${ this.url}
            domSelector: ${ this.domSelector}`;
    };
};

export { Crawler as Crawler };