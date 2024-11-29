import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Employee } from 'src/app/shared/models/Employee';
import { IndexedDbService } from 'src/app/shared/services/indexed-db.service';
import { MatDialog } from '@angular/material/dialog';
import { CustomDatePickerComponent } from 'src/app/shared/custom-date-picker/custom-date-picker.component';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss'],
})
export class AddEmployeeComponent {
  employeeForm: FormGroup
  employees: Employee[] = []
  employee!: Employee
  constructor(
    private fb: FormBuilder,
    private indexedDBService: IndexedDbService, 
    private router: Router,
    private dialog: MatDialog,
    private datePipe: DatePipe) {
    this.employeeForm = this.fb.group({
      id:  [null], 
      name: [''],
      role: [''],
      startDate: [],
      endDate: ['']
    })
    let navigationExtras = this.router.getCurrentNavigation()?.extras.state
    if (navigationExtras) {
      this.employee = navigationExtras["employeeDetails"]
      this.editEmployee(this.employee)
    }
  }

  editEmployee(employee: Employee) {
    this.employeeForm.patchValue({
      id: employee.id,
      name: employee.name,
      role: employee.role,
      startDate: employee.startDate,
      endDate: employee.endDate,
    })
  }

  async saveEmployee() {
    const formValue = this.employeeForm.value
    let employee = new Employee()
    employee.name = formValue.name
    employee.role = formValue.role
    employee.startDate = formValue.startDate
    employee.endDate = formValue.endDate ? formValue.endDate : null 
    if (formValue.id) {
      employee["id"] = formValue.id;
      await this.indexedDBService.updateEmployee(employee)
    } else {
      await this.indexedDBService.addEmployee(employee)
    }
    this.router.navigateByUrl("employee/employee-list")
  }

  async deleteEmployee(id: number) {
    await this.indexedDBService.deleteEmployee(id)
  }

  onCancel() {
    this.employeeForm.reset()
  }

  goBack() {
    this.router.navigateByUrl("employee/employee-list")
  }
  
  openCalendar(dateType: string) {
    const dialogRef = this.dialog.open(CustomDatePickerComponent, {
      width: '400px',
    })
    dialogRef.afterClosed().subscribe((date) => {
      if (date) {
        let formattedDate = this.datePipe.transform(date, 'MMM d, y')
        if(dateType == "startDate") { 
          this.employeeForm.controls['startDate']?.setValue(
            formattedDate 
          )
          this.employeeForm.controls['startDate'].updateValueAndValidity()
        }
        if(dateType == "endDate") {
          this.employeeForm.controls['endDate']?.setValue(
            formattedDate
          )
          this.employeeForm.controls['endDate'].updateValueAndValidity()
        }
      }
    })
  }
}
