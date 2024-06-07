import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, take } from 'rxjs/operators';
import { AuthService } from '../../../shared/services/auth.service';
import { ClientService } from '../../../shared/services/client.service';
import { DialogsService } from 'src/app/shared/services/dialogs.services';
import { SelfcareService } from 'src/app/shared/services/selfcare.service';
import { Router, RouteConfigLoadStart, ResolveStart, RouteConfigLoadEnd, ResolveEnd } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  animations: [SharedAnimations]
})
export class SigninComponent implements OnInit {
  loading: boolean;
  loadingText: string;
  signinForm: FormGroup;
  otpForm: FormGroup;
  company: any;
  form: any = {};

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private clientService: ClientService,
    private router: Router,
    private dialogs: DialogsService,
    private service: SelfcareService,
  ) { }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof RouteConfigLoadStart || event instanceof ResolveStart) {
        this.loadingText = 'Loading Dashboard Module...';

        this.loading = true;
      }
      if (event instanceof RouteConfigLoadEnd || event instanceof ResolveEnd) {
        this.loading = false;
      }
    });

    this.signinForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.otpForm = this.fb.group({
      otp: new FormControl("", Validators.compose([
        Validators.required,
        Validators.pattern('^[0-9]{6}$')
      ])),
      phone: new FormControl("", Validators.compose([
        Validators.required,
        Validators.pattern('^[6,7,8,9][0-9]{9}$')
      ])),
    });

    document.title = "ERP - SignIn";

    var domain = window.location.hostname;
    this.clientService.listCompanies({ filters: { getCompany: true, domain: domain } }).pipe(take(1)).subscribe(
      res => {
        if (res['data'] && res['data'].length) {
          this.company = res['data'][0];

          document.title = this.company.name + " - ERP";
          if (this.company.primaryColor && this.company.accentColor) {
            document.documentElement.style.setProperty('--primary-color', this.company.primaryColor);
            document.documentElement.style.setProperty('--accent-color', this.company.accentColor);
          }
        }
      })
  }

  emailLogin: boolean = true;
  signin() {
    this.loading = true;
    this.loadingText = 'Sigining in...';
    var data = this.signinForm.value;
    if (!this.emailLogin) {
      data = { phone: this.form.phone };
    }
    this.auth.signin(data)
      .pipe(take(1)).subscribe(res => {
        this.loading = false;
      });
  }

  otp: any;
  otpSent: any = false;
  requestOtp() {
    var data = {
      phone: this.form.phone,
      context: "Login"
    }
    this.form.otp = null;
    this.loading = true;
    this.service.requestOTP(data).pipe(take(1)).subscribe(
      (res) => {
        if (res['data']) {
          this.otpSent = true;
          this.loadingText = 'Sending OTP ...';
          this.dialogs.success("An OTP has sent to your mobile " + this.form.phone + ". Please verify OTP request. ")
        } else if (res['error']) {
          this.dialogs.error(res['error'])
        }
        this.loading = false;
      })
  }

  verifyOtp() {
    var self = this;
    var data: any = {
      phone: this.form.phone,
      context: "Login",
      otp: this.form.otp
    }
    this.loading = true;
    this.service.verifyOTP(data).pipe(take(1)).subscribe(
      (res) => {
        if (res['data']) {
          data = {
            phone: this.form.phone,
            otpVerified: true
          }
          this.auth.signin(data)
            .pipe(take(1)).subscribe(res => {
              this.loading = false;
            });
        } else if (res['error']) {
          this.loading = false;
          this.dialogs.error(res['error'])
        }
      })

  }


}
