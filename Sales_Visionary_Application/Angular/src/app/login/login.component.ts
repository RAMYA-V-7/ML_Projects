import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient ,HttpClientModule} from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup | any;
  user:any;
  loggedIn:any;
  title = 'material-login';
  public userval:string='';
  public userpass:string='';

  constructor(
    private router:Router,
    private authService: SocialAuthService,
    private snackBar:MatSnackBar,
    private http: HttpClient,
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email,Validators.pattern(
        '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,63}$',
      ),]),
      password: new FormControl('', [Validators.required,Validators.pattern(
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,12}$'
      )])
    });

   }
   getName(val:string)
  {
    this.userval=val;
  }
  getPass(pas:string)
  {
    this.userpass=pas;
  }
  ngOnInit(){
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
      console.log(this.user)
    });
  }
 
  onSubmit(){
    if(!this.loginForm.valid){
      return;
    }
    else{
    this.router.navigate(['/file'])
    this.snackBar.open('Ready for prediction','Yes')
    localStorage.setItem('user',this.loginForm.value)
    //console.log("Hi",this.userval)
  }
  let loginInfo={
    'emailId':this.userval,
    'password':this.userpass
  }
  this.http.post('http://localhost:5000/api/loginInfo',loginInfo).subscribe((response)=>{
  let data = response;
 
});
  }
//   fileUpload() {
//     if (this.file){
//       let data={
//         'choice':this.selected,
//         'period':this.numberofperiod
//       }
//     this.http.post('http://localhost:5000/api/Choice',data).subscribe((response)=>{
//     console.log(response)
//     this._snackBar.open("Choice Of Period Is Sent Successfully", "Ok", { duration: 5000 });
//  });
// }
//       let url = "http://localhost:5000/api/fileupload"
//       this.http.post(url, this.formfile).subscribe((res) => {
//         this.showLoader = false;
//         this._snackBar.open("File successfully uploaded", "Ok", { duration: 5000 });
//       },
//         (error) => {
//           this.showLoader = false;
//           this._snackBar.open(error.message, "Close", { duration: 5000 });
//         });
//   }
}
