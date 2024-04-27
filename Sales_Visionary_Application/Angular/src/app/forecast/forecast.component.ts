import { Component,AfterViewInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.css']
})
export class ForecastComponent implements AfterViewInit{
  chart: any;
  actual: JSON|any;
  forecasted: JSON|any;
  dataPoints1: any=[];
  dataPoints2:any=[];
  dataPoints:any=[];
  loginDetails:any=[];
  constructor(
    private http: HttpClient,
    private router :Router
  ){ }
  chartOptions = {
    theme: "light1",
    zoomEnabled: true,
    exportEnabled: true,
    backgroundColor: "rgb(214, 187, 242)",
    title: {
      text:"Sales Forecasting Application - Actual Values Vs Forecasted Values",
      fontFamily: "Bodoni MT",
        fontWeight: "bold",
        fontColor: "darkblue"
    },
    subtitles: [{
      text: "Loading Actual VS Forecasted Data...",
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
      type: "area",
      color: "darkblue",
      markerType: "square",
      name: "Actual Values Up To Date",
      yValueFormatString: "$####.00",
      xValueType: "dateTime",
      lineDashType: "dash",
      showInLegend: true,
     dataPoints: this.dataPoints1
    },
    {
      type: "area",
      color: "Purple",
      markerType: "square",
      name: "Forecasted Values",
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
  ngAfterViewInit(){
    this.http.get('http://127.0.0.1:5000/actualuptodate', { responseType:'json' }).subscribe((response: any) => {
        let data = response;
        for(let i = 0; i < data.length; i++){
          this.dataPoints1.push({x: new Date(data[i].Date), y: Number(data[i].Sales) });
        }
       
      });
      this.http.get('http://127.0.0.1:5000/forecasted', { responseType:'json' }).subscribe((response: any) => {
        let data1 = response;
        for(let i = 0; i < data1.length; i++){
          this.dataPoints2.push({x: new Date(data1[i].Date), y: Number(data1[i].Forecast) });
        
        }
        this.chart.subtitles[0].remove();
      });
  }
  // addTable(){
  //   var tableData = "";
  //   for(var i = 0; i < this.chart.data.length; i++){
  //       tableData += "<tr>" + "<td style='color:" + this.chart.data[i].color + "'>■" + this.chart.data[i].name + "</td>";
  //       for(var j = 0; j < this.chart.data[i].dataPoints.length; j++){
  //         tableData += ("<td>" + this.chart.data[i].dataPoints[j].y +"%</td>")
  //       }
  //       tableData += "</tr>";
  //   }
  //   $("#chartData").append(tableData)
  // }
MoveToMetrics()
{
  this.router.navigate(['/metrics']);
}
ngOnInit(): void {
}
  getActualVsForecasted(){
    this.http.get('http://127.0.0.1:5000/actualuptodate').subscribe(data => {
      this.actual = data as JSON;
      console.log(this.actual);
    })
    this.http.get('http://127.0.0.1:5000/forecasted').subscribe(data => {
      this.forecasted = data as JSON;
      console.log(this.forecasted);
    })
  }
}