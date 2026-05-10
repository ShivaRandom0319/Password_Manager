import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { PasswordRecord, PasswordRecordRequest } from '../models/password-record.model';

interface ApiMessage {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class PasswordService {
  private readonly apiUrl = `${environment.apiUrl}/passwords`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<PasswordRecord[]> {
    return this.http.get<PasswordRecord[]>(this.apiUrl);
  }

  getById(id: number): Observable<PasswordRecord> {
    return this.http.get<PasswordRecord>(`${this.apiUrl}/${id}`);
  }

  create(record: PasswordRecordRequest): Observable<PasswordRecord> {
    return this.http.post<PasswordRecord>(this.apiUrl, record);
  }

  update(id: number, record: PasswordRecordRequest): Observable<PasswordRecord> {
    return this.http.put<PasswordRecord>(`${this.apiUrl}/${id}`, record);
  }

  delete(id: number): Observable<ApiMessage> {
    return this.http.delete<ApiMessage>(`${this.apiUrl}/${id}`);
  }

  searchByName(name: string): Observable<PasswordRecord[]> {
    return this.http.get<PasswordRecord[]>(`${this.apiUrl}/search`, {
      params: { name }
    });
  }
}
