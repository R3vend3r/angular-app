import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { DataService } from '../data.service'; // Adjust the path as necessary

Chart.register(...registerables);

@Component({
  selector: 'app-diary-statistics',
  standalone: true,
  imports: [],
  templateUrl: './diary-statistics.component.html',
  styleUrl: './diary-statistics.component.scss'
})
export class DiaryStatisticsComponent implements OnInit {
  public chart: any;

  ngOnInit(): void {
    setTimeout(() => {
      this.createChart();
    }, 0);
  }

  createChart() {
    this.chart = new Chart('diaryChart', {
      type: 'bar', // тип графика
      data: {
        labels: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'], // метки по оси X
        datasets: [{
          label: 'Количество записей',
          data: [10, 15, 8, 12, 20, 25, 3, 19, 12, 6, 22, 13], // данные для графика
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}