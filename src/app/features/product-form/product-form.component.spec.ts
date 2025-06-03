import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductFormComponent } from './product-form.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ProductService } from '../../core/services/product/product.service';
import { AlertService } from '../../core/services/alert/alert.service';
import { Product } from '../../core/interfaces/product';
import { ContainerComponent } from '../../shared/components/container/container.component';
import { CommonModule } from '@angular/common';

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;
  let productService: jest.Mocked<ProductService>;
  let alertService: jest.Mocked<AlertService>;

  const mockProduct: Product = {
    id: 'trj-crd',
    name: 'Tarjetas de Crédito',
    description: 'Tarjeta para crédito personal',
    logo: 'https://logo.png',
    date_release: new Date('2025-01-01'),
    date_revision: new Date('2026-01-01')
  };

  beforeEach(async () => {
    const productServiceMock: Partial<jest.Mocked<ProductService>> = {
      getById: jest.fn().mockReturnValue(of(mockProduct)),
      add: jest.fn().mockReturnValue(of(mockProduct)),
      update: jest.fn().mockReturnValue(of(mockProduct)),
      verifyId: jest.fn().mockReturnValue(of(false)),
    };

    const alertServiceMock: Partial<jest.Mocked<AlertService>> = {
      fire: jest.fn(),
      clear: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [CommonModule, ReactiveFormsModule, ContainerComponent, ProductFormComponent],
      providers: [
        FormBuilder,
        { provide: ProductService, useValue: productServiceMock },
        { provide: AlertService, useValue: alertServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: new Map().set('id', 'trj-crd') }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService) as jest.Mocked<ProductService>;
    alertService = TestBed.inject(AlertService) as jest.Mocked<AlertService>;

    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with values in edit mode', () => {
    expect(productService.getById).toHaveBeenCalledWith('trj-crd');
    expect(component.productForm.value.name).toBe(mockProduct.name);
  });

  it('should submit form and call update in edit mode', () => {
    component.isEditMode = true;
    component.productForm.patchValue(mockProduct);
    component.onSubmit();
    expect(productService.update).toHaveBeenCalledWith(mockProduct.id, expect.objectContaining(mockProduct));
    expect(alertService.fire).toHaveBeenCalledWith(expect.objectContaining({ type: 'success' }));
  });

  it('should submit form and call add in create mode', () => {
    component.isEditMode = false;
    component.productForm.enable(); // Enable ID field
    component.productForm.patchValue(mockProduct);
    component.onSubmit();
    expect(productService.add).toHaveBeenCalledWith(expect.objectContaining(mockProduct));
    expect(alertService.fire).toHaveBeenCalledWith(expect.objectContaining({ type: 'success' }));
  });

  it('should not submit if form is invalid', () => {
    component.productForm.patchValue({
      id: '',
      name: '',
      description: '',
      logo: '',
      date_release: '',
      date_revision: ''
    });
    component.onSubmit();
    expect(productService.add).not.toHaveBeenCalled();
    expect(productService.update).not.toHaveBeenCalled();
  });

  it('should show error alert when add fails', () => {
    productService.add.mockReturnValueOnce(throwError(() => new Error('error')));
    component.isEditMode = false;
    component.productForm.patchValue(mockProduct);
    component.onSubmit();
    expect(alertService.fire).toHaveBeenCalledWith(expect.objectContaining({ type: 'error' }));
  });

  it('should show error alert when update fails', () => {
    productService.update.mockReturnValueOnce(throwError(() => new Error('error')));
    component.isEditMode = true;
    component.productForm.patchValue(mockProduct);
    component.onSubmit();
    expect(alertService.fire).toHaveBeenCalledWith(expect.objectContaining({ type: 'error' }));
  });

  it('should reset form but preserve ID field in edit mode', () => {
    component.isEditMode = true;
    component.productForm.get('id')?.setValue('trj-crd');
    component.onReset();
    expect(component.productForm.get('id')?.value).toBe('trj-crd');
  });

  it('should validate ID as taken', () => {
    productService.verifyId.mockReturnValueOnce(of(true));
    component.isEditMode = false;
    component.productForm.get('id')?.setValue('duplicated-id');
    component.validateId();
    fixture.detectChanges();

    // Give time for async observable
    expect(productService.verifyId).toHaveBeenCalledWith('duplicated-id');
  });
});
