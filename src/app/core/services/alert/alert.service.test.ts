import { AlertService, AlertOptions } from './alert.service';
import { fakeAsync, tick } from '@angular/core/testing';

describe('AlertService', () => {
    let service: AlertService;

    beforeEach(() => {
        service = new AlertService();
    });

    it('should emit alert with provided options when fire is called', done => {
        const options: AlertOptions = {
            message: 'Test alert',
            type: 'success',
            closable: false
        };

        service.alert$.subscribe(alert => {
            if (alert) {
                expect(alert).toEqual({
                    message: 'Test alert',
                    type: 'success',
                    closable: false
                });
                done();
            }
        });

        service.fire(options);
    });

    it('should use default type "info" and closable true when not provided', done => {
        const options: AlertOptions = { message: 'Default alert' };

        service.alert$.subscribe(alert => {
            if (alert) {
                expect(alert).toEqual({
                    message: 'Default alert',
                    type: 'info',
                    closable: true
                });
                done();
            }
        });

        service.fire(options);
    });

    it('should clear the alert when clear is called', fakeAsync(() => {
        const options: AlertOptions = { message: 'Test warning', type: 'warning' };
        let emissions: any[] = [];

        service.alert$.subscribe(alert => {
            if(alert || emissions.length > 0){
                emissions.push(alert);
            }
        });

        service.fire(options);
        tick();
        service.clear();
        tick();
        expect(emissions.length).toBe(2);
        expect(emissions[0]).toEqual({
            message: 'Test warning',
            type: 'warning',
            closable: true
        });
        expect(emissions[1]).toBeNull();
    }));
});