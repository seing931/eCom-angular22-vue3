import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environment';

@Injectable({
    providedIn:'root'
})

export class OrderService{
constructor(
    private http:HttpClient){}
    
    getAllOrdLists(){
        return this.http.get(
            `${environment.apiUrl}/order`
        );
    }

    getById(id:number){
        return this.http.get(
            `${environment.apiUrl}/order/${id}`
        );
    }
}