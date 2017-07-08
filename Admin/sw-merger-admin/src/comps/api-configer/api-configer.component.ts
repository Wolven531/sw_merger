import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Component({
    selector: 'api-configer-cont',
    templateUrl: './api-configer.component.html',
    styleUrls: ['./api-configer.component.css'],
})
export class ApiConfigerComponent implements OnInit {
    public BASE_URL:string = 'http://127.0.0.1:5555';
    // TODO: awill: make sure the hide actually works
    private hideNav:boolean = true;

    constructor(private http: Http) { };
    checkLocal(): Promise<void> {
        return this.http.get(this.BASE_URL)
            .toPromise()
            .then(resp => {
                if (resp.status !== 200) {
                    const setupLocal = confirm('API is not running locally, start it?');
                    return;
                }
                this.BASE_URL = resp.json().base;
            })
            .catch(this.handleError);
    };
    goToServer(): void {
        window.open(this.BASE_URL, '_blank');
    };
    ngOnInit(): void {
        this.checkLocal();
    };
    private handleError(error: any): Promise<any> {
        console.error(`An error occurred: err=${ error } err.message=${ error.message }`);
        return Promise.reject(error.message || error);
    };
};
