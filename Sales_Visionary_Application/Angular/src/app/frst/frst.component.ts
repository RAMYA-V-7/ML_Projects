import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-frst',
  templateUrl: './frst.component.html',
  styleUrls: ['./frst.component.css']
})
export class FrstComponent implements OnInit {
[x: string]: any;

  constructor() { }

  
  ngOnInit(): void {
    document.body.className = "selector";
  }

}
