import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { ProductListComponent } from './product-list.component';
import { ProductService } from '../../core/services/product/product.service';
import { AlertService } from '../../core/services/alert/alert.service';
import { Product } from '../../core/interfaces/product';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productServiceMock: jest.Mocked<ProductService>;
  let alertServiceMock: jest.Mocked<AlertService>;

  const now = new Date();
  const sampleProducts: Product[] = [
    { id: 'uno', name: 'Product A', logo: 'http://sample.com/', description: 'Desc A', date_release: now, date_revision: now },
    { id: 'dos', name: 'Product B', logo: 'http://sample.com/', description: 'Desc B', date_release: now, date_revision: now },
    { id: 'tres', name: 'Test Product', logo: 'http://sample.com/', description: 'Desc Test', date_release: now, date_revision: now }
  ];

  beforeEach(async () => {
    productServiceMock = {
      getAll: jest.fn().mockReturnValue(of(sampleProducts))
    } as any;

    alertServiceMock = {
      fire: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [
        { provide: ProductService, useValue: productServiceMock },
        { provide: AlertService, useValue: alertServiceMock },
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', fakeAsync(() => {
    component.ngOnInit();
    tick();
    expect(productServiceMock.getAll).toHaveBeenCalled();
    expect(component.products).toEqual(sampleProducts);

    const itemsPerPage = component.itemsPerPageControl.value || 5;
    expect(component.pagedProducts).toEqual(sampleProducts.slice(0, itemsPerPage));
  }));

  it('should apply filters when searchControl value changes', fakeAsync(() => {
    component.products = sampleProducts;
    component.searchControl.setValue('Test');
    tick();
    expect(component.filteredProducts.length).toBe(1);
    expect(component.filteredProducts[0].name).toContain('Test');
  }));

  it('should return empty filteredProducts when search term does not match', fakeAsync(() => {
    component.products = sampleProducts;
    component.searchControl.setValue('NoMatch');
    tick();
    expect(component.filteredProducts.length).toBe(0);
    expect(component.pagedProducts.length).toBe(0);
  }));

  it('should reset currentPage to 1 and paginate when itemsPerPageControl value changes', fakeAsync(() => {
    component.products = sampleProducts;
    component.filteredProducts = sampleProducts;
    component.currentPage = 2;
    component.itemsPerPageControl.setValue(2);
    tick();
    expect(component.currentPage).toBe(1);
    expect(component.pagedProducts).toEqual(sampleProducts.slice(0, 2));
  }));

  it('should use default itemsPerPage when value is null', () => {
    component.filteredProducts = [...sampleProducts, ...sampleProducts];
    component.itemsPerPageControl.setValue(null);
    component.currentPage = 1;
    component.paginate();
    expect(component.pagedProducts.length).toBe(5);
  });

  it('should handle error when loadProducts fails', fakeAsync(() => {
    const errorMessage = 'Error loading';
    productServiceMock.getAll.mockReturnValueOnce(throwError(() => ({ message: errorMessage })));

    component.loadProducts();
    tick();

    expect(alertServiceMock.fire).toHaveBeenCalledWith({
      message: errorMessage,
      type: 'error',
      closable: true,
      duration: 5000
    });
    expect(component.loading).toBe(false);
  }));

  it('should go to a specific page', () => {
    component.filteredProducts = [...sampleProducts, ...sampleProducts]; // 6 items
    component.itemsPerPageControl.setValue(2);
    component.goToPage(2);
    expect(component.currentPage).toBe(2);
    expect(component.pagedProducts.length).toBe(2);
  });

  it('should not go to an invalid page', () => {
    component.filteredProducts = sampleProducts;
    component.itemsPerPageControl.setValue(2);
    component.currentPage = 1;
    component.goToPage(0); // invalid
    expect(component.currentPage).toBe(1);
  });

  it('should go to next page', () => {
    component.filteredProducts = [...sampleProducts, ...sampleProducts]; // 6 items
    component.itemsPerPageControl.setValue(2);
    component.currentPage = 1;
    component.nextPage();
    expect(component.currentPage).toBe(2);
  });

  it('should go to previous page', () => {
    component.filteredProducts = sampleProducts;
    component.itemsPerPageControl.setValue(1);
    component.currentPage = 2;
    component.prevPage();
    expect(component.currentPage).toBe(1);
  });

  it('should not go to previous page if already on page 1', () => {
    component.currentPage = 1;
    component.prevPage();
    expect(component.currentPage).toBe(1);
  });

  it('should calculate total pages correctly', () => {
    component.filteredProducts = [...sampleProducts, ...sampleProducts]; // 6 items
    component.itemsPerPageControl.setValue(4);
    expect(component.totalPages).toBe(2);
  });
    it('should set productId and show delete modal when requestDelete is called', () => {
    const product: Product = sampleProducts[0];
    component.requestDelete(product);
    expect(component.productId).toBe(product.id);
    expect(component.showDeleteModal).toBe(true);
  });

  it('should call delete and reload products on delete confirm', fakeAsync(() => {
    const productToDelete = sampleProducts[0];
    component.productId = productToDelete.id ?? null;
    const deleteSpy = jest.fn().mockReturnValue(of(null));
    productServiceMock.delete = deleteSpy;

    const loadProductsSpy = jest.spyOn(component, 'loadProducts');
    
    component.onDeleteConfirm();
    tick();

    expect(deleteSpy).toHaveBeenCalledWith(productToDelete.id);
    expect(alertServiceMock.fire).toHaveBeenCalledWith({ message: 'Producto eliminado.', type: 'success' });
    expect(component.showDeleteModal).toBe(false);
    expect(loadProductsSpy).toHaveBeenCalled();
  }));

  it('should handle error during delete', fakeAsync(() => {
    component.productId = 'some-id';
    productServiceMock.delete = jest.fn().mockReturnValue(throwError(() => ({ message: 'Delete failed' })));

    component.onDeleteConfirm();
    tick();

    expect(alertServiceMock.fire).toHaveBeenCalledWith({
      message: 'Delete failed',
      type: 'error',
      closable: true,
      duration: 5000
    });
    expect(component.showDeleteModal).toBe(false);
  }));

  it('should not call delete if productId is null', () => {
    component.productId = null;
    const deleteSpy = jest.fn();
    productServiceMock.delete = deleteSpy;
    
    component.onDeleteConfirm();
    
    expect(deleteSpy).not.toHaveBeenCalled();
  });

  it('should navigate to product modification page when modify is called', () => {
    const navigateSpy = jest.spyOn(component['router'], 'navigate');
    const product = { ...sampleProducts[0], id: 'prod123' };

    component.modify(product);

    expect(navigateSpy).toHaveBeenCalledWith(['/product', 'prod123']);
  });

  it('should not navigate when modify is called with product without id', () => {
    const navigateSpy = jest.spyOn(component['router'], 'navigate');
    const product = { ...sampleProducts[0], id: undefined };

    component.modify(product);

    expect(navigateSpy).not.toHaveBeenCalled();
  });

});
