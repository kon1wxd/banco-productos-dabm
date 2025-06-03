import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError, throwError } from 'rxjs';
import { Product } from '../../interfaces/product';
import { environment } from '../../../../environments/environment';
import { AlertService } from '../alert/alert.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // Base URL for product-related API endpoints
  private readonly baseUrl = `${environment.apiUrl}/bp/products`;

  // Inject HttpClient for HTTP requests and AlertService for user notifications
  constructor(private http: HttpClient, private alertService: AlertService) {}

  /**
   * Fetch all products from the API.
   * @returns Observable<Product[]>
   */
  getAll(): Observable<Product[]> {
    return this.http.get<{ data: Product[] }>(this.baseUrl).pipe(
      map(res => res.data), // Extract the data array from the response
      catchError(this.handleError) // Handle errors
    );
  }

  /**
   * Fetch a single product by its ID.
   * @param id Product ID
   * @returns Observable<Product>
   */
  getById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }
  
  /**
   * Verify if a product ID exists.
   * @param id Product ID
   * @returns Observable<boolean>
   */
  verifyId(id: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/verification/${id}`);
  }

  /**
   * Add a new product.
   * @param product Product object
   * @returns Observable<Product>
   */
  add(product: Product): Observable<Product> {
    return this.http.post<{ data: Product }>(this.baseUrl, product).pipe(
      map(res => res.data),
      catchError(this.handleError)
    );
  }

  /**
   * Update an existing product by ID.
   * @param id Product ID
   * @param product Product object without the ID
   * @returns Observable<Product>
   */
  update(id: string, product: Omit<Product, 'id'>): Observable<Product> {
    return this.http.put<{ data: Product }>(`${this.baseUrl}/${id}`, product).pipe(
      map(res => res.data),
      catchError(this.handleError)
    );
  }

  /**
   * Delete a product by ID.
   * @param id Product ID
   * @returns Observable<any>
   */
  delete(id: string): Observable<any> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Handle HTTP errors and notify the user.
   * @param error HttpErrorResponse
   * @returns Observable<never>
   */
  private handleError(error: HttpErrorResponse) {
    this.alertService.fire({message: error.message, type: 'error'});
    return throwError(() => new Error(error.message));
  }
}
