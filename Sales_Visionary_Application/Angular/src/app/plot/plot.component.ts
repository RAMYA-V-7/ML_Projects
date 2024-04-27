import { Component,AfterViewInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-plot',
  templateUrl: './plot.component.html',
  styleUrls: ['./plot.component.css']
})

export class PlotComponent implements AfterViewInit{
  actual: JSON | any;
  predicted: JSON|any;
  chart: any;
  dataPoints1: any=[];
  dataPoints2:any=[];
  dataPoints:any=[]
  constructor(
    private http: HttpClient,
    private router :Router
    ) { }
    chartOptions = {
      theme: "light1",
      zoomEnabled: true,
      exportEnabled: true,
      backgroundColor: "rgb(214, 187, 242)",
      title: {
        text:"Sales Forecasting Application - Actual Values Vs Predicted Values",
        fontFamily: "Bodoni MT",
        fontWeight: "bold",
        fontColor: "darkblue"
      },
      subtitles: [{
        text: "Loading Sales Actual VS Predcition Data...",
        fontSize: 20,
        fontColor: "Red",
        horizontalAlign: "center",
        verticalAlign: "center",
        dockInsidePlotArea: true
      }],axisY: {
        title: "Values Of Sales Data",
        titleFontColor: "darkblue",
        titleFontFamily: "Bodoni MT",
        titleFontWeight: "bold",
        fontStyle: "italic",
        margin: 7,
        labelFontFamily: "Bodoni MT",
        labelFontColor: "purple",
        labelFontSize: 15,
        labelFontWeight: "bold",
        prefix: "$",
        crosshair: {
          enabled: true,
          snapToDataPoint: true
        }
      },
      axisX: {
        title: "Time Period Of Selling Sales Data",
        titleFontColor: "darkblue",
        titleFontFamily: "Bodoni MT",
        titleFontWeight: "bold",
        fontStyle: "italic",
        margin: 7,
        labelFontFamily: "Bodoni MT",
        labelFontColor: "purple",
        labelFontSize: 15,
        labelFontWeight: "bold",
        crosshair: {
          enabled: true,
          snapToDataPoint: true
        }
      },
      legend:{
        cursor: "pointer",
        verticalAlign: "bottom",
        horizontalAlign: "right",
        dockInsidePlotArea: true,
        fontSize: 25,
        fontFamily: "Bodoni Mt",
        fontColor: "black",
        fontWeight: "bold",
       
        itemclick: function(e: any) {
          if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
          } else{
            e.dataSeries.visible = true;
          }
          e.chart.render();
        }
      },
      data: [{
        type: "line",
        color: "darkblue",
        markerType: "square",
        name: "Predicted Sales",
        yValueFormatString: "$####.00",
        xValueType: "dateTime",
        lineDashType: "dash",
		    showInLegend: true,
        dataPoints: this.dataPoints1
      },
      {
        type: "line",
        color: "Purple",
        markerType: "square",
        name: "Actual Sales",
        yValueFormatString: "$####.00",
        xValueType: "dateTime",
        lineDashType: "dash",
        showInLegend: true,
        dataPoints: this.dataPoints2
      },
    ]
    }

    getChartInstance(chart: object) {
      this.chart = chart;
    }  

  ngOnInit(){
  }

  getActualVsPredicted() {
      this.http.get('http://127.0.0.1:5000/actual').subscribe(data => {
        this.actual = data as JSON;
        console.log(this.actual);
        
      })
      this.http.get('http://127.0.0.1:5000/predicted').subscribe(data => {
        this.predicted = data as JSON;
        console.log(this.predicted);
      })
    }
    ngAfterViewInit(){
      this.http.get('http://127.0.0.1:5000/predicted', { responseType:'json' }).subscribe((response: any) => {
        let data = response;
        for(let i = 0; i < data.length; i++){
          this.dataPoints1.push({x: new Date(data[i].Date), y: Number(data[i].Sales) });
        }
       
      });
      this.http.get('http://127.0.0.1:5000/actual', { responseType:'json' }).subscribe((response: any) => {
        let data1 = response;
        for(let i = 0; i < data1.length; i++){
          this.dataPoints2.push({x: new Date(data1[i].Date), y: Number(data1[i].Sales) });
        }
        this.chart.subtitles[0].remove();
      });
    }
    MoveToForecast()
    {
      this.router.navigate(['/forecast']);
    }



  // let act=this.predicted
      // for(let i = 0; i <act.length; i++){
      //   this.dataPoints.push({x: new Date(act[i].Date), y: Number(act[i].Sales) });
      // } 
      // this.chart.subtitles[0].remove();
    }

/*
 ngAfterViewInit() {
    this.http.get('https://canvasjs.com/data/gallery/angular/btcusd2021.json', { responseType: 'json' }).subscribe((response: any) => {
      let data = response;
      for(let i = 0; i < data.length; i++){
        this.dataPoints.push({x: new Date(data[i].date), y: Number(data[i].close) });
      }
      this.chart.subtitles[0].remove();
    });
  }
*/