import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environment';

@Injectable({
    providedIn:'root'
})

export class CustomerService{
constructor(
    private http:HttpClient){}
    getAll(){
        return this.http.get(
            `${environment.apiUrl}/cust`
        );
    }

    getById(id:number){
        return this.http.get(
            `${environment.apiUrl}/cust/${id}`
        );
    }

    create(model:any){
        return this.http.post(
            `${environment.apiUrl}/cust`,
        model
        );
    }

    update(id:number,model:any){
        return this.http.put(
        `${environment.apiUrl}/cust/${id}`,
        model
        );
    }

    delete(id:number){
        return this.http.delete(
        `${environment.apiUrl}/cust/${id}`
        );
    }
}