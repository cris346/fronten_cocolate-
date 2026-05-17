import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface BoxSize {
  id: number;
  name: 'Chica' | 'Grande';
  capacity: number;
  basePrice: number;
}

export interface CatalogResponse {
  boxSizes: BoxSize[];
  flavors: string[];
  fillings: string[];
}

@Injectable({
  providedIn: 'root'
})
export class CatalogService {
  private http = inject(HttpClient);

  getCatalog() {
    return this.http.get<CatalogResponse>(`${environment.apiUrl}/catalog`);
  }
}
