import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/product/product.service';
import { Product } from '../../core/interfaces/product';
import { AlertService } from '../../core/services/alert/alert.service';
import { ContainerComponent } from "../../shared/components/container/container.component";

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ContainerComponent],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent implements OnInit {

  // Determines if the form is in edit mode
  @Input() isEditMode: boolean = false;
  // Reactive form group for the product form
  productForm!: FormGroup;
  // Today's date, used for validations or default values
  today = new Date();

  // Inject required services
  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private alertService: AlertService
  ) {}

  // Lifecycle hook: initialize form and load product if editing
  ngOnInit(): void {
    this.buildForm();

    // Check if editing an existing product
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(id);
      this.productForm.get('id')?.disable();
      this.isEditMode = true;
    }

    // Automatically update revision date when release date changes
    this.productForm.get('date_release')?.valueChanges.subscribe((releaseDate: string) => {
      const revisionDate = new Date(releaseDate);
      revisionDate.setFullYear(revisionDate.getFullYear() + 1);
      const formatted = revisionDate.toISOString().split('T')[0];
      this.productForm.get('date_revision')?.setValue(formatted);
    });
  }

  // Build the product form with validation rules
  buildForm(): void {
    this.productForm = this.fb.group({
      id: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', Validators.required],
      date_release: ['', Validators.required],
      date_revision: [{ value: '', disabled: true }, Validators.required]
    });
  }

  // Load a product by ID and patch form values
  loadProduct(id: string) {
    this.productService.getById(id).subscribe({
      next: (product: Product) => {
        this.productForm.patchValue(product);
        // Format dates for input fields
        const formattedRelease = new Date(product.date_release).toISOString().split('T')[0];
        const formattedRevision = new Date(product.date_revision).toISOString().split('T')[0];
        this.productForm.patchValue({
          date_release: formattedRelease,
          date_revision: formattedRevision
        });
      },
      error: (err) => {
        this.alertService.fire({ message: 'Error al cargar el producto.', type: 'error' });
      }
    });
  }

  // Validate if the product ID already exists (only in create mode)
  validateId() {
    const id = this.productForm.get('id')?.value;
    if (!this.isEditMode && id) {
      this.productService.verifyId(id).subscribe(exists => {
        if (exists) {
          this.productForm.get('id')?.setErrors({ exists: true });
        }
      });
    }
  }

  // Handle form submission for create or update
  onSubmit(): void {
    if (this.productForm.invalid) return;

    const rawData = this.productForm.getRawValue();
    const product: Product = {
      ...rawData,
      id: this.isEditMode ? this.route.snapshot.paramMap.get('id')! : rawData.id
    };

    if (this.isEditMode) {
      // Update existing product
      this.productService.update(product.id!, product).subscribe({
        next: res => {
          this.alertService.fire({ message: 'Producto actualizado exitosamente.', type: 'success' });
        },
        error: err => {
          this.alertService.fire({ message: 'Error al actualizar el producto.', type: 'error' });
        }
      });
    } else {
      // Create new product
      this.productService.add(product).subscribe({
        next: res => {
          this.alertService.fire({ message: 'Producto creado exitosamente.', type: 'success' });
          this.productForm.reset();
        },
        error: err => {
          this.alertService.fire({ message: 'Error al crear el producto.', type: 'error' });
        }
      });
    }
  }

  // Reset the form, preserving the ID value
  onReset(): void {
    const idControl = this.productForm.get('id');
    const idValue = idControl?.value;
    this.productForm.reset();
    idControl?.setValue(idValue);
  }

  // Getter for easy access to form controls in the template
  get f(): { [key: string]: AbstractControl } {
    return this.productForm.controls;
  }
}