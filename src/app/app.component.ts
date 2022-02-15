import { Component } from '@angular/core';
import * as Highcharts from 'highcharts';
import { of } from 'rxjs';
import { concatMap, delay } from 'rxjs/operators';
import { webSocket } from 'rxjs/webSocket';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  rate: any;
  Highcharts: typeof Highcharts = Highcharts;
  chardata: any[] = [];
  chartOptions: any;
  subject = webSocket('wss://ws.coincap.io/prices?assets=bitcoin')
  ngOnInit() {
    this.rate = this.subject.pipe(
      concatMap(item => of(item).pipe(delay(100)))
    ).subscribe(data => {
      this.rate = data;
      this.chardata.push(Number(this.rate.bitcoin))
      this.chartOptions = {
        series: [{
          data: this.chardata,
        },],
        chart: {
          type: "line",
          zoomType: 'x'
        },
        title: {
          text: "POC of Live data",
        },
        yAxis: {
          title: {
            text: 'Price'
          }
        },
        xAxis: {
          title: {
            text: 'Time'
          }
        },
        legend: {
          layout: 'horizantal',
          align: 'center',
          verticalAlign: 'bottom'
      },
      };
    })
  }
}
