import { Component,AfterViewInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.css']
})
export class MetricsComponent implements AfterViewInit {
  metrics:JSON|any;
  chart: any;
  dataPoints:any=[]

    chartOptions = {
      theme: "light1",
      backgroundcolor:"darkblue",
      zoomEnabled: true,
      exportEnabled: true,
      animationEnabled: true,
      backgroundColor: "rgb(230, 187, 145)",
      title: {
        text:"Sales Forecasting - Performance Metrics",
        fontFamily: "Bodoni MT",
        fontWeight: "bold",
        fontColor: "black"
        
      },
      subtitles: [{
        text: "Loading Metrics,Please Wait......",
        fontSize: 20,
        fontColor: "Red",
        horizontalAlign: "center",
        verticalAlign: "center",
        dockInsidePlotArea: true
      }],axisY: {
        title: "Values Of Sales Data",
        yValueFormatString: "######",
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
        fontSize: 15,
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
        type: "pie",
		indexLabel: "{name}: {y}",
		valueRepresents: "area",
		    showInLegend: true,
        bevelEnabled: true,
        indexLabelPlacement: "outside",
        indexLabelFontSize: 16,
        indexLabelFontColor: "black",
        indexLabelLineDashType: "dot",
        indexLabelBackgroundColor: "",
        indexLabelFontFamily: "Bodoni MT",
        indexLabelFontWeight: "bold",
        dataPoints: this.dataPoints
      },
    ]
    }


  constructor(
    private http: HttpClient,
    private router :Router
  ) { }
 
  getChartInstance(chart: object) {
    this.chart = chart;
  }  
  ngOnInit(): void {
  }

  getmetrics() {
    this.http.get('http://127.0.0.1:5000/metrics').subscribe(data => {
      this.metrics = data as JSON;
      console.log(this.metrics);
    })
  }
  ngAfterViewInit(){
    this.http.get('http://127.0.0.1:5000/metrics', { responseType:'json' }).subscribe((response: any) => {
      let data = response;
      for(let i = 0; i < data.length; i++){
        this.dataPoints.push({name: data[i].MetricsName, y:Number(data[i].MetricsValue) });
      }
      this.chart.subtitles[0].remove();

    });
  }
  MoveToLogin()
  {
    this.router.navigate(['/summary']);
  }
}
