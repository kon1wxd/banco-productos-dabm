import { AlertComponent } from './alert.component';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { AlertService, AlertOptions } from '../../../core/services/alert/alert.service';

class AlertServiceStub {
  alert$ = new Subject<AlertOptions | null>();
  clear = jest.fn();
}

describe('AlertComponent', () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;
  let alertService: AlertServiceStub;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [{ provide: AlertService, useClass: AlertServiceStub }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;
    alertService = TestBed.inject(AlertService) as unknown as AlertServiceStub;
    fixture.detectChanges();
  });

  it('should initialize with no alert', () => {
    expect(component.alert).toBeNull();
  });

  it('should update alert and duration when the alert service emits', () => {
    const alertData: AlertOptions = { message: 'Test Alert', duration: 1000 } as AlertOptions;
    alertService.alert$.next(alertData);
    fixture.detectChanges();
    expect(component.alert).toEqual(alertData);
    expect(component.duration).toEqual(1000);
  });

  it('should auto-close after the specified duration', fakeAsync(() => {
    const alertData: AlertOptions = { message: 'Auto close test', duration: 1000 } as AlertOptions;
    alertService.alert$.next(alertData);
    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();
    expect(component.alert).toBeNull();
    expect(alertService.clear).toHaveBeenCalled();
  }));

  it('should clear the alert manually when close is called', () => {
    const alertData: AlertOptions = { message: 'Manual close test', duration: 1000 } as AlertOptions;
    alertService.alert$.next(alertData);
    fixture.detectChanges();
    component.close();
    expect(component.alert).toBeNull();
    expect(alertService.clear).toHaveBeenCalled();
  });

  it('should unsubscribe from the alert observable on destroy', () => {
    const unsubscribeSpy = jest.spyOn((component as any).sub, 'unsubscribe');
    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });

});
