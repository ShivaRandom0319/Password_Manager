import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { PasswordRecord } from '../../models/password-record.model';
import { PasswordService } from '../../services/password.service';

@Component({
  selector: 'app-password-list',
  templateUrl: './password-list.component.html'
})
export class PasswordListComponent implements OnInit {
  records: PasswordRecord[] = [];
  searchName = '';
  isLoading = false;
  errorMessage = '';
  copiedMessage = '';
  visiblePasswords = new Set<number>();

  constructor(private passwordService: PasswordService, private router: Router) {}

  ngOnInit(): void {
    this.loadRecords();
  }

  loadRecords(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.copiedMessage = '';

    this.passwordService.getAll().subscribe({
      next: (records) => {
        this.records = records;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Could not load password records.';
        this.isLoading = false;
      }
    });
  }

  search(): void {
    const name = this.searchName.trim();

    if (!name) {
      this.loadRecords();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.copiedMessage = '';

    this.passwordService.searchByName(name).subscribe({
      next: (records) => {
        this.records = records;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Search failed.';
        this.isLoading = false;
      }
    });
  }

  togglePassword(id: number): void {
    if (this.visiblePasswords.has(id)) {
      this.visiblePasswords.delete(id);
      return;
    }

    this.visiblePasswords.add(id);
  }

  isPasswordVisible(id: number): boolean {
    return this.visiblePasswords.has(id);
  }

  copyText(value: string, label: string): void {
    if (!navigator.clipboard) {
      this.copiedMessage = 'Copy is not available in this browser.';
      return;
    }

    navigator.clipboard.writeText(value).then(() => {
      this.copiedMessage = `${label} copied`;
      setTimeout(() => this.copiedMessage = '', 1800);
    }).catch(() => {
      this.copiedMessage = 'Copy failed.';
    });
  }

  editRecord(id: number): void {
    this.router.navigate(['/dashboard/passwords/edit', id]);
  }

  deleteRecord(id: number): void {
    const shouldDelete = confirm('Delete this password record?');

    if (!shouldDelete) {
      return;
    }

    this.passwordService.delete(id).subscribe({
      next: () => this.loadRecords(),
      error: () => {
        this.errorMessage = 'Delete failed.';
      }
    });
  }
}
