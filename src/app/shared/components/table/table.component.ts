import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, ContentChild, ContentChildren, Input, QueryList, TemplateRef } from '@angular/core';
import { Column } from '../../../core/interfaces/column';

@Component({
  selector: 'app-table',
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent {
  // Columns configuration for the table
  @Input() columns: Column[] = [];
  // Data to display in the table
  @Input() data: any[] = [];
  // Loading state for the table
  @Input() loading: boolean = false;

  // Support for custom template for 'logo' column
  @ContentChild('logoTpl') logoTpl!: TemplateRef<any>;
  // Support for custom template for 'actions' column
  @ContentChild('actionsTpl') actionsTpl!: TemplateRef<any>;

  /**
   * Returns the custom template for a given column if available.
   * @param col Column name
   * @returns TemplateRef or null
   */
  getTemplate(col: string): TemplateRef<any> | null {
    if (col === 'logo') return this.logoTpl;
    if (col === 'actions') return this.actionsTpl;
    return null;
  }

  /**
   * Checks if a column has a custom template.
   * @param col Column name
   * @returns boolean
   */
  hasCustomTemplate(col: string): boolean {
    return !!this.getTemplate(col);
  }
}