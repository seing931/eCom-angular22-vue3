import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environment';

@Injectable({
    providedIn:'root'
})

export class EmployeeService{
constructor(
    private http:HttpClient){}
    getAll(){
        return this.http.get(
            `${environment.apiUrl}/emp`
        );
    }

    getById(id:number){
        return this.http.get(
            `${environment.apiUrl}/emp/${id}`
        );
    }

    create(model:any){
        return this.http.post(
            `${environment.apiUrl}/emp`,
        model
        );
    }

    update(id:number,model:any){
        return this.http.put(
        `${environment.apiUrl}/emp/${id}`,
        model
        );
    }

    delete(id:number){
        return this.http.delete(
        `${environment.apiUrl}/emp/${id}`
        );
    }
}