import { Component } from '@angular/core';
import { Product } from '../../core/interfaces/product';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TableComponent } from '../../shared/components/table/table.component';
import { AlertService } from '../../core/services/alert/alert.service';
import { ProductService } from '../../core/services/product/product.service';
import { Column } from '../../core/interfaces/column';
import { Router, RouterModule } from '@angular/router';
import { ContainerComponent } from "../../shared/components/container/container.component";
import { ConfirmModalComponent } from "../../shared/components/confirm-modal/confirm-modal.component";

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, ReactiveFormsModule, TableComponent, RouterModule, ContainerComponent, ConfirmModalComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent {
  // All products loaded from the API
  products: Product[] = [];
  // Products after filtering (search)
  filteredProducts: Product[] = [];
  // Products to display on the current page
  pagedProducts: Product[] = [];
  // Table column configuration
  columns: Column[] = [
    { key: 'logo', label: 'Logo', center: true },
    { key: 'name', label: 'Nombre del producto' },
    { key: 'description', label: 'Descripción', desc: 'Descripción del Producto' },
    { key: 'date_release', label: 'Fecha de liberación', desc: 'Fecha a liberar el producto para los clientes en General' },
    { key: 'date_revision', label: 'Fecha de reestructuración', desc: 'Fecha de revisión del producto para cambiar Términos y Condiciones' },
    { key: 'actions', label: '', center: true } // Action column
  ];

  // Loading state for the table
  loading: boolean = true;
  // ID of the product selected for deletion
  productId: string | null = null;
  // Controls visibility of the delete confirmation modal
  showDeleteModal: boolean = false;
  // Form control for search input
  searchControl = new FormControl('');
  // Form control for items per page selection
  itemsPerPageControl = new FormControl(5);
  // Current page number for pagination
  currentPage: number = 1;

  // Inject required services
  constructor(private productService: ProductService, private alertService: AlertService, private router: Router) { }

  // Initialize component: load products and set up subscriptions for search and pagination controls
  ngOnInit(): void {
    this.loadProducts();

    // React to search input changes
    this.searchControl.valueChanges.subscribe(() => {
      this.applyFilters();
    });

    // React to items-per-page changes
    this.itemsPerPageControl.valueChanges.subscribe(() => {
      this.currentPage = 1;
      this.paginate();
    });
  }

  // Load all products from the API
  loadProducts(): void {
    this.loading = true;
    this.productService.getAll().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = products;
        this.paginate();
      },
      error: (err) => {
        // Show error alert if loading fails
        this.alertService.fire({
          message: err.message,
          type: 'error',
          closable: true, duration: 5000
        });
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  // Apply search filter to products
  applyFilters(): void {
    const term = (this.searchControl.value || '').toLowerCase();
    this.filteredProducts = this.products.filter(p =>
      p.name.toLowerCase().includes(term)
    );
    this.paginate();
  }

  // Paginate filtered products for current page
  paginate(): void {
    const itemsPerPage = this.itemsPerPageControl.value || 5;
    const start = (this.currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    this.pagedProducts = this.filteredProducts.slice(start, end);
  }

  // Calculate total number of pages
  get totalPages(): number {
    const itemsPerPage = this.itemsPerPageControl.value || 5;
    return Math.ceil(this.filteredProducts.length / itemsPerPage) ?? 0;
  }

  // Go to a specific page
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.paginate();
    }
  }

  // Go to the next page
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginate();
    }
  }

  // Go to the previous page
  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginate();
    }
  }

  // Request to delete a product (shows confirmation modal)
  requestDelete(product: Product) {
    this.productId = product.id ?? null;
    this.showDeleteModal = true;
  }

  // Confirm deletion of a product
  onDeleteConfirm() {
    if (!this.productId) { return; }
    this.productService.delete(this.productId!).subscribe({
      next: () => {
        // Show success alert and reload products
        this.alertService.fire({ message: 'Producto eliminado.', type: 'success' });
        this.showDeleteModal = false;
        this.loadProducts();
      },
      error: (err) => {
        // Show error alert if deletion fails
        this.alertService.fire({
          message: err.message || 'Ocurrió un error al eliminar el producto.',
          type: 'error',
          closable: true,
          duration: 5000
        });
        this.showDeleteModal = false;
      }
    });
  }

  // Navigate to the product modification page
  modify(product: Product) {
    if (!product?.id) return;
    this.router.navigate(['/product', product.id]);
  }
}