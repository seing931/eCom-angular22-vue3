import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn:'root'
})

export class ProductService{
constructor(
    private http:HttpClient){}
    getAll(){
        return this.http.get(
            `${environment.apiUrl}/prod`
        );
    }
    
    getById(id:number){
        return this.http.get(
            `${environment.apiUrl}/prod/${id}`
        );
    }

    create(formData: FormData): Observable<any> {
        return this.http.post(
            `${environment.apiUrl}/prod`, formData);
    }

    update(id:number,formData: FormData): Observable<any> {
        return this.http.put(
            `${environment.apiUrl}/prod/${id}`, formData);
    }

    delete(id:number){
        return this.http.delete(
        `${environment.apiUrl}/prod/${id}`
        );
    }
}