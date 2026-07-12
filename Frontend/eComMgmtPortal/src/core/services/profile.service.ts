import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environment';

@Injectable({
    providedIn:'root'
})

export class ProfileService{
constructor(
    private http:HttpClient){}

    getProfile(id:number){
        return this.http.get(
            `${environment.apiUrl}/profile/${id}`
        );
    }

    edit(id: number, model: FormData) {
      return this.http.put(
        `${environment.apiUrl}/profile/${id}`,
        model
    );
  }
}