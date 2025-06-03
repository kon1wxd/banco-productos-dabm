import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertOptions, AlertService } from '../../../core/services/alert/alert.service';

@Component({
  selector: 'app-alert',
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent {
  // Holds the current alert options or null if no alert is shown
  alert: AlertOptions | null = null;
  // Stores the timeout ID for auto-dismiss
  timeoutId: any;
  // Subscription to the alert observable
  private sub: Subscription;
  // Duration for which the alert is shown (ms)
  duration: number = 3000; // ms, configurable by type or default value

  constructor(private alertService: AlertService) {
    // Subscribe to alert changes from the AlertService
    this.sub = this.alertService.alert$.subscribe(alert => {
      this.alert = alert;
      
      // Use alert-specific duration if provided, otherwise use default
      this.duration = alert?.duration ?? this.duration;

      // Clear any existing timeout
      if (this.timeoutId) clearTimeout(this.timeoutId);
      // If there's an alert, set a timeout to auto-close it
      if (alert) { this.timeoutId = setTimeout(() => this.close(), this.duration); }

    });
  }

  // Manually close the alert and clear timeout
  close() {
    this.alertService.clear();
    this.alert = null;
    if (this.timeoutId) clearTimeout(this.timeoutId);
  }

  // Cleanup subscription and timeout on component destroy
  ngOnDestroy() {
    this.sub.unsubscribe();
    if (this.timeoutId) clearTimeout(this.timeoutId);
  }
}