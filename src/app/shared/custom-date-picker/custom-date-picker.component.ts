import { Component } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-custom-date-picker',
  templateUrl: './custom-date-picker.component.html',
  styleUrls: ['./custom-date-picker.component.scss']
})
export class CustomDatePickerComponent {
  selectedDate: Date | null = this.dateAdapter.today()

  constructor(
    private dialogRef: MatDialogRef<CustomDatePickerComponent>,
    private dateAdapter: DateAdapter<Date>
  ) {}

  selectToday() {
    this.selectedDate = this.dateAdapter.today(); 
  }

  selectNextMonday() {
    this.selectedDate = this.calculateNextWeekday(1); 
  }

  selectNextTuesday() {
    this.selectedDate = this.calculateNextWeekday(2); 
  }

  selectAfterWeek() {
    const today = this.dateAdapter.today();
    this.selectedDate = this.addDays(today, 7); 
  }

  calculateNextWeekday(targetDay: number): Date {
    const today = this.dateAdapter.today();
    const dayOfWeek = today.getDay();
    const daysToAdd = (targetDay - dayOfWeek + 7) % 7 || 7;
    return this.addDays(today, daysToAdd);
  }

  addDays(date: Date, days: number): Date {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + days);
    return newDate;
  }

  cancel() {
    this.dialogRef.close();
  }

  save() {
    this.dialogRef.close(this.selectedDate); 
  }
}
