import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { PasswordService } from '../../services/password.service';

@Component({
  selector: 'app-add-password',
  templateUrl: './add-password.component.html'
})
export class AddPasswordComponent {
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
    private router: Router
  ) {}

  onSubmit(): void {
    this.errorMessage = '';

    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formValue = this.passwordForm.getRawValue();

    this.passwordService.create({
      name: formValue.name ?? '',
      username: formValue.username ?? '',
      password: formValue.password ?? ''
    }).subscribe({
      next: () => this.router.navigate(['/dashboard/passwords']),
      error: () => {
        this.errorMessage = 'Could not save password record.';
        this.isSubmitting = false;
      }
    });
  }
}
