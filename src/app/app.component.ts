import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'personal-website';
  constructor(private http: HttpClient) {

  }
  public emailForm = new FormGroup({
    name: new FormControl(),
    email: new FormControl(),
    phoneNumber: new FormControl(),
    message: new FormControl()
  });
  sendEmail() {
    this.http.post('https://api.alamaq.com/api/Auth/SendEmailTo', this.emailForm.value).subscribe(res => {

    });
  }
}
