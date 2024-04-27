import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NewsComponent } from './news/news.component';
@Injectable({
  providedIn: 'root'
})
export class NewsService {

  constructor(private snackBar:MatSnackBar) { }

  showNotification(displayMessage: string,buttonText: string,messageType:'OOPS'|'GREAT')
  {
    this.snackBar.openFromComponent(NewsComponent,{
      data : {
        message:displayMessage,
        buttonText:buttonText,
        type:messageType
      },
     // duration : 5000 ,to  display snackbar for 5 seconds
      verticalPosition:'top',
      //to add colors to the snackbar
      panelClass:messageType
    })
  }
}
