import { Component,AfterViewInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements AfterViewInit{
  
login:any=[]
  constructor(
    private http: HttpClient,
    private router :Router
  ) { }

  ngAfterViewInit(){
    this.http.get('http://127.0.0.1:5000/loginInfo', { responseType:'json' }).subscribe((response: any) => {
      let data = response;
      for(let i = 0; i < data.length; i++){
        this.login.push({x: data[i].EmailId, y: data[i].Password});
      }
      console.log("Summary : ")
      console.log(this.login)
    });
    
  }
  Users()
  {
    // console.log("Summary : ")
    // console.log(this.login)
    
  }

}
