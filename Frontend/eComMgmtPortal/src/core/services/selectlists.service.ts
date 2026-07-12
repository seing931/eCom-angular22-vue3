import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environment';

@Injectable({
    providedIn:'root'
})

export class SelectlistsService{
constructor(
    private http:HttpClient){}
    getSupp(){
        return this.http.get(
            `${environment.apiUrl}/auth/supp`
        );
    }
    getCat() {
        return this.http.get(
            `${environment.apiUrl}/auth/cat`
        );
    }

    getSubCat(catId: number) {
        return this.http.get(
            `${environment.apiUrl}/auth/subcat?catId=${catId}`
        );
    }
}