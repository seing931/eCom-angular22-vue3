import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environment';

@Injectable({
    providedIn:'root'
})

export class SupplierService{
constructor(
    private http:HttpClient){}
    getAll(){
        return this.http.get(
            `${environment.apiUrl}/supplier`
        );
    }

    getById(id:number){
        return this.http.get(
            `${environment.apiUrl}/supplier/${id}`
        );
    }

    create(model:any){
        return this.http.post(
            `${environment.apiUrl}/supplier`,
        model
        );
    }

    update(id:number,model:any){
        return this.http.put(
        `${environment.apiUrl}/supplier/${id}`,
        model
        );
    }

    delete(id:number){
        return this.http.delete(
        `${environment.apiUrl}/supplier/${id}`
        );
    }
}