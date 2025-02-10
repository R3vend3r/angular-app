import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../common-ui/header/header.component";
import { WelcomeToPmComponent } from "./welcome-to-pm/welcome-to-pm.component";
import { FeaturePComponent } from "./feature-p/feature-p.component";
import { FooterComponent } from "../../common-ui/footer/footer.component";
import { DiaryStatisticsComponent } from "../../forms/diary-statistics/diary-statistics.component";
import { DataService } from '../../shared/data.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, WelcomeToPmComponent, FeaturePComponent, FooterComponent, DiaryStatisticsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent implements OnInit {
  currentPage: any;

  constructor( private dataService: DataService){}

  ngOnInit(): void {
    const userEmail = localStorage.getItem('userEmail');
    if(userEmail){
      this.dataService.getUserByEmail(userEmail).subscribe(userData => {
        console.log('Полученные данные пользователя:', userData);
        if (userData) {
            localStorage.setItem('userId', userData.id.toString());
        } else {
            console.error('Пользователь с данным email не найден:', userEmail);
        }
      }, error => {
          console.error('Ошибка при загрузке пользователя:', error);
      });
    }      
  }
}