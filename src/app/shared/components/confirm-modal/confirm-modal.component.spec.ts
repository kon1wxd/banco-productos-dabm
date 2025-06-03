import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmModalComponent } from './confirm-modal.component';
import { By } from '@angular/platform-browser';

describe('ConfirmModalComponent', () => {
  let component: ConfirmModalComponent;
  let fixture: ComponentFixture<ConfirmModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmModalComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not render modal if `show` is false', () => {
    component.show = false;
    fixture.detectChanges();
    const modal = fixture.debugElement.query(By.css('.modal'));
    expect(modal).toBeNull();
  });

  it('should render modal if `show` is true', () => {
    component.show = true;
    fixture.detectChanges();
    const modal = fixture.debugElement.query(By.css('.modal'));
    expect(modal).toBeTruthy();
  });

  it('should emit `confirm` event on confirm button click', () => {
    component.show = true;
    fixture.detectChanges();

    jest.spyOn(component.confirm, 'emit');
    const button = fixture.debugElement.query(By.css('.btn.primary')).nativeElement;
    button.click();

    expect(component.confirm.emit).toHaveBeenCalled();
  });

  it('should emit `cancel` event on cancel button click', () => {
    component.show = true;
    fixture.detectChanges();

    jest.spyOn(component.cancel, 'emit');
    const button = fixture.debugElement.query(By.css('.btn.secondary')).nativeElement;
    button.click();

    expect(component.cancel.emit).toHaveBeenCalled();
  });

  it('should display custom title and message', () => {
    component.show = true;
    component.message = 'Esta acción no se puede deshacer.';
    fixture.detectChanges();

    const message = fixture.debugElement.query(By.css('p')).nativeElement.textContent;

    expect(message).toContain('Esta acción no se puede deshacer.');
  });
});
