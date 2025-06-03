import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Interface for alert options
export interface AlertOptions {
  message: string; // The alert message to display
  type?: 'success' | 'error' | 'warning' | 'info'; // Type of alert
  closable?: boolean; // Whether the alert can be closed by the user
  duration?: number; // Optional duration for auto-dismiss
}

// Injectable service available app-wide
@Injectable({ providedIn: 'root' })
export class AlertService {
  // Subject to hold the current alert state
  private alertSubject = new BehaviorSubject<AlertOptions | null>(null);

  // Observable for components to subscribe to alert changes
  alert$ = this.alertSubject.asObservable();

  // Fire a new alert with given options
  fire(options: AlertOptions) {
    this.alertSubject.next({
      type: options.type || 'info', // Default type is 'info'
      closable: options.closable ?? true, // Default closable to true
      message: options.message // Alert message
    });
  }

  // Clear the current alert
  clear() {
    this.alertSubject.next(null);
  }
}