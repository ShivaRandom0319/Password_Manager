import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { PasswordService } from '../../services/password.service';

@Component({
  selector: 'app-edit-password',
  templateUrl: './edit-password.component.html'
})
export class EditPasswordComponent implements OnInit {
  recordId = 0;
  isLoading = false;
  isSubmitting = false;
  errorMessage = '';

  passwordForm = this.formBuilder.group({
    name: ['', [Validators.required]],
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  constructor(
    private formBuilder: FormBuilder,
    private passwordService: PasswordService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.recordId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadRecord();
  }

  loadRecord(): void {
    this.isLoading = true;

    this.passwordService.getById(this.recordId).subscribe({
      next: (record) => {
        this.passwordForm.patchValue({
          name: record.name,
          username: record.username,
          password: record.password
        });
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Could not load password record.';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formValue = this.passwordForm.getRawValue();

    this.passwordService.update(this.recordId, {
      name: formValue.name ?? '',
      username: formValue.username ?? '',
      password: formValue.password ?? ''
    }).subscribe({
      next: () => this.router.navigate(['/dashboard/passwords']),
      error: () => {
        this.errorMessage = 'Could not update password record.';
        this.isSubmitting = false;
      }
    });
  }
}
