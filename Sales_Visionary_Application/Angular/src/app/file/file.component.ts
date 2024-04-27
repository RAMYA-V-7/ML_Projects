
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient ,HttpClientModule} from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.css']
})
export class FileComponent implements OnInit {
  selected = 'Week';
  numberofperiod:any;
  file:any;
  filename: any;
  formfile: any;
  format: any;
  showLoader: boolean = false;
  constructor(
    private _snackBar: MatSnackBar,
    private http: HttpClient,
    private router:Router,
  ) { }
  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000);
    }
    return value;
  }
  pitch(event: any) {
    this.numberofperiod=event.value
    console.log(this.numberofperiod);
  }
  ngOnInit(): void {
  }
  
  onFileSelect(event: any) {
    try{
       this.file = event.target.files[0];
      if (this.file) {
        this.filename = this.file.name;
        this.format = this.file.name.split('.');
        //this.format = this.format[1];
        if (this.format[1] != 'csv'){
          this._snackBar.open("Please select only CSV file", "Close", { duration: 3000 });
          this.deleteFile();
        } 
        else{
          this.formfile = new FormData();
          this.formfile.append('file', this.file);
          console.log(this.formfile);
        }
      }
    } catch (error) {
      this.deleteFile();
      console.log('no file was selected...');
    }
  }
  
  fileUpload() {
    if (this.file){
      let data={
        'choice':this.selected,
        'period':this.numberofperiod
      }
    this.http.post('http://localhost:5000/api/Choice',data).subscribe((response)=>{
    console.log(response)
    this._snackBar.open("Choice Of Period Is Sent Successfully", "Ok", { duration: 5000 });
 });
}
      let url = "http://localhost:5000/api/fileupload"
      this.http.post(url, this.formfile).subscribe((res) => {
        this.showLoader = false;
        this._snackBar.open("File successfully uploaded", "Ok", { duration: 5000 });
      },
        (error) => {
          this.showLoader = false;
          this._snackBar.open(error.message, "Close", { duration: 5000 });
        });
  }

  deleteFile(){
    this.file = null;
    this.format = null;
    this.filename = null;
    this.formfile.delete('file');
    }
    ActVsPre()
    {
      this.router.navigate(['/plot']);
    }
}
