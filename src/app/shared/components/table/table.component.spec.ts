import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableComponent } from './table.component';
import { TemplateRef } from '@angular/core';

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;

  // We recommend installing an extension to run jest tests.

  // Dummy TemplateRef to simulate a template reference.
  class DummyTemplateRef implements TemplateRef<any> {
    elementRef = { nativeElement: document.createElement('div') };
    createEmbeddedView(context: any) { return null as any; }
  }

  describe('TableComponent', () => {
    let component: TableComponent;
    let fixture: ComponentFixture<TableComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TableComponent]
      }).compileComponents();

      fixture = TestBed.createComponent(TableComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    describe('getTemplate', () => {
      it('should return logoTpl when the column is "logo"', () => {
        const dummyTemplate = new DummyTemplateRef();
        component.logoTpl = dummyTemplate;
        expect(component.getTemplate('logo')).toBe(dummyTemplate);
      });

      it('should return null for columns other than "logo"', () => {
        const dummyTemplate = new DummyTemplateRef();
        component.logoTpl = dummyTemplate;
        expect(component.getTemplate('not-logo')).toBeNull();
      });
    });

    describe('hasCustomTemplate', () => {
      it('should return true when a custom logo template is provided', () => {
        const dummyTemplate = new DummyTemplateRef();
        component.logoTpl = dummyTemplate;
        expect(component.hasCustomTemplate('logo')).toBe(true);
      });

      it('should return false when no custom template is provided', () => {
        // simulate absence of a template by setting logoTpl to undefined
        component.logoTpl = undefined as unknown as TemplateRef<any>;
        expect(component.hasCustomTemplate('logo')).toBe(false);
      });
    });
  });
});