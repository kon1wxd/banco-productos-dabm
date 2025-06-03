import { TestBed } from '@angular/core/testing';

import { ProductService } from './product.service';
import { HttpClientTestingModule, HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Product } from '../../interfaces/product';
import { environment } from '../../../../environments/environment.development';
import { provideHttpClient } from '@angular/common/http';


describe('ProductService', () => {
  let service: ProductService;
  let httpTestingController: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/bp/products`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [ProductService, provideHttpClient(), provideHttpClientTesting() ],
    });
    service = TestBed.inject(ProductService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#getAll', () => {
    it('should retrieve all products', () => {
      const dummyProducts: Product[] = [
        {
          id: 'trj-crd',
          name: 'Tarjetas de Crédito',
          description: 'Tarjeta de consumo bajo la modalidad de crédito',
          logo: 'https://www.visa.com.ec/c/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature400x225.jpg',
          date_release: new Date('2023-02-01'),
          date_revision: new Date('2024-02-01'),
        },
        {
          id: 'trj-deb',
          name: 'Tarjetas de Débito',
          description: 'Tarjeta de débito para transacciones diarias',
          logo: 'https://www.visa.com.ec/c/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/debit-card.jpg',
          date_release: new Date('2023-01-15'),
          date_revision: new Date('2024-01-15'),
        },
      ];

      service.getAll().subscribe((products) => {
        expect(products).toEqual(dummyProducts);
      });

      const req = httpTestingController.expectOne(baseUrl);
      expect(req.request.method).toEqual('GET');
      req.flush({ data: dummyProducts });
    });

    it('should handle error in getAll', () => {
      const errorMessage = 'Network error';

      service.getAll().subscribe({
        next: () => fail('expected an error'),
        error: (error) => {
          expect(error.message).toEqual(errorMessage);
        },
      });

      const req = httpTestingController.expectOne(baseUrl);
      req.flush({ message: errorMessage }, { status: 500, statusText: 'Server Error' });
    });
  });
  
  describe('#getById', () => {
    it('should retrieve a product by ID', () => {
      const id = 'trj-crd';
      const product: Product = {
        id,
        name: 'Tarjetas de Crédito',
        description: 'Tarjeta de consumo bajo la modalidad de crédito',
        logo: 'https://www.visa.com.ec/c/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature400x225.jpg',
        date_release: new Date('2023-02-01'),
        date_revision: new Date('2024-02-01'),
      };

      service.getById(id).subscribe((result) => {
        expect(result).toEqual(product);
      });

      const req = httpTestingController.expectOne(`${baseUrl}/${id}`);
      expect(req.request.method).toEqual('GET');
      req.flush({ data: product });
    });

    it('should handle error in getById', () => {
      const id = 'trj-crd';
      const errorMessage = 'Network error';

      service.getById(id).subscribe({
        next: () => fail('expected an error'),
        error: (error) => {
          expect(error.message).toEqual(errorMessage);
        }
      });

      const req = httpTestingController.expectOne(`${baseUrl}/${id}`);
      req.flush({ message: errorMessage }, { status: 500, statusText: 'Server Error' });
    });
  });

  describe('#verifyId', () => {
    it('should verify product id', () => {
      const id = '1';
      service.verifyId(id).subscribe((result) => {
        expect(result).toBe(true);
      });
      const req = httpTestingController.expectOne(`${baseUrl}/verification/${id}`);
      expect(req.request.method).toEqual('GET');
      req.flush(true);
    });
  });

  describe('#add', () => {
    it('should add a product and return it', () => {
      const newProduct: Product = {
        id: 'trj-deb',
        name: 'Tarjetas de Débito',
        description: 'Tarjeta de débito para transacciones diarias',
        logo: 'https://www.visa.com.ec/c/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/debit-card.jpg',
        date_release: new Date('2023-01-15'),
        date_revision: new Date('2024-01-15')
      };

      service.add(newProduct).subscribe((product) => {
        expect(product).toEqual(newProduct);
      });

      const req = httpTestingController.expectOne(baseUrl);
      expect(req.request.method).toEqual('POST');
      req.flush({
        message: 'Product added successfully',
        data: newProduct
      });
    });

    it('should handle error in add', () => {
      const newProduct: Product = {
        id: 'trj-deb',
        name: 'Tarjetas de Débito',
        description: 'Tarjeta de débito para transacciones diarias',
        logo: 'https://www.visa.com.ec/c/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/debit-card.jpg',
        date_release: new Date('2023-01-15'),
        date_revision: new Date('2024-01-15')
      };
      const errorMessage = 'Network error';

      service.add(newProduct).subscribe({
        next: () => fail('expected an error'),
        error: (error) => {
          expect(error.message).toEqual(errorMessage);
        },
      });

      const req = httpTestingController.expectOne(baseUrl);
      req.flush({ message: errorMessage }, { status: 500, statusText: 'Server Error' });
    });
  });

  describe('#update', () => {
    it('should update a product and return the updated product', () => {
      const id = 'trj-deb';
      const updatedProduct: Product = {
        id,
        name: 'Tarjetas de Débito',
        description: 'Tarjeta de débito para transacciones diarias',
        logo: 'https://www.visa.com.ec/c/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/debit-card.jpg',
        date_release: new Date('2023-01-15'),
        date_revision: new Date('2024-01-15')
      };
      const updateData: any = { name: 'Updated Product', description: 'Tarjeta actualizada!' };
      service.update(id, updateData).subscribe((product) => {
        expect(product).toEqual(updatedProduct);
      });

      const req = httpTestingController.expectOne(`${baseUrl}/${id}`);
      expect(req.request.method).toEqual('PUT');
      req.flush({
        message: 'Product updated successfully',
        data: updatedProduct
      });
    });

    it('should handle error in update', () => {
      const id = 'trj-deb';
      const updateData: any = { name: 'Updated Product', description: 'Tarjeta actualizada!' };
      const errorMessage = 'Network error';

      service.update(id, updateData).subscribe({
        next: () => fail('expected an error'),
        error: (error) => {
          expect(error.message).toEqual(errorMessage);
        },
      });

      const req = httpTestingController.expectOne(`${baseUrl}/${id}`);
      req.flush({ message: errorMessage }, { status: 500, statusText: 'Server Error' });
    });
  });

  describe('#delete', () => {
    it('should delete a product and return a success message', () => {
      const id = 'trj-deb';

      service.delete(id).subscribe((response) => {
        expect(response).toEqual('Product removed successfully');
      });

      const req = httpTestingController.expectOne(`${baseUrl}/${id}`);
      expect(req.request.method).toEqual('DELETE');
      req.flush({ message: 'Product removed successfully' });
    });

    it('should handle error in delete', () => {
      const id = 'trj-deb';
      const errorMessage = 'Network error';

      service.delete(id).subscribe({
        next: () => fail('expected an error'),
        error: (error) => {
          expect(error.message).toEqual(errorMessage);
        },
      });

      const req = httpTestingController.expectOne(`${baseUrl}/${id}`);
      req.flush({ message: errorMessage }, { status: 500, statusText: 'Server Error' });
    });
  });
});
