import { Injectable } from '@angular/core'
import { openDB, IDBPDatabase } from 'idb'
import { Employee } from '../models/Employee'

@Injectable({
  providedIn: 'root',
})

export class IndexedDbService {
  private dbName = 'EmployeeDB'
  private storeName = 'employees'
  private dbPromise!: Promise<IDBPDatabase>
  constructor() {
    this.initDB()
  }

  async initDB() {
    this.dbPromise = openDB(this.dbName, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('employees')) {
          db.createObjectStore('employees', { keyPath: 'id', autoIncrement: true });
        }
      },
    })
  }

  async addEmployee(employee: Employee): Promise<any> {
    const db = await this.dbPromise
    return db.add(this.storeName, employee)
  }

  async getAllEmployees(): Promise<Employee[]> {
    const db = await this.dbPromise
    return db.getAll(this.storeName)
  }

  async updateEmployee(employee: Employee): Promise<any> {
    const db = await this.dbPromise
    return db.put(this.storeName, employee)
  }

  async deleteEmployee(id: number): Promise<any> {
    const db = await this.dbPromise
    return db.delete(this.storeName, id)
  }
}
