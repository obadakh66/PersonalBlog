import { Component, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  sending = false;
  sent = false;
  sendError = false;

  emailForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phoneNumber: new FormControl(''),
    message: new FormControl('', [Validators.required, Validators.minLength(10)])
  });

  constructor(private http: HttpClient) {}

  get f() { return this.emailForm.controls; }

  sendEmail(): void {
    if (this.emailForm.invalid || this.sending) {
      this.emailForm.markAllAsTouched();
      return;
    }

    this.sending = true;
    this.sent = false;
    this.sendError = false;

    const { name, email, phoneNumber, message } = this.emailForm.value;

    const text = [
      `📬 *New message from your portfolio*`,
      ``,
      `👤 *Name:* ${name}`,
      `📧 *Email:* ${email}`,
      phoneNumber ? `📞 *Phone:* ${phoneNumber}` : null,
      ``,
      `💬 *Message:*`,
      message
    ]
      .filter(line => line !== null)
      .join('\n');

    const { botToken, chatId } = environment.telegram;
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    this.http
      .post(url, { chat_id: chatId, text, parse_mode: 'Markdown' })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.sending = false;
          this.sent = true;
          this.emailForm.reset();
        },
        error: () => {
          this.sending = false;
          this.sendError = true;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
