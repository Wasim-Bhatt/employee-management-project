import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Employee } from 'src/app/shared/models/Employee';
import { IndexedDbService } from 'src/app/shared/services/indexed-db.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {
  currentEmployees: Employee[] = []
  previousEmployees: Employee[] = []

  constructor(
    private router: Router,
    private indexedDbService: IndexedDbService) {}

  async ngOnInit() {
    await this.indexedDbService.initDB()
    const employees = await this.indexedDbService.getAllEmployees()
    this.currentEmployees = employees.filter(emp => !emp.endDate)
    this.previousEmployees = employees.filter(emp => emp.endDate)
  }

  async deleteEmployee(id: number) {
    await this.indexedDbService.deleteEmployee(id)
    await this.ngOnInit()
  }
  
  addEmployee() {
    this.router.navigateByUrl("employee-list/add-employee", { replaceUrl: true})
  }

  editEmployee(employee: Employee) {
    const navigationExtras: NavigationExtras = {
      state: {
        employeeDetails: employee
      },
    }
    this.router.navigateByUrl("employee-list/add-employee", navigationExtras)
  }
}
