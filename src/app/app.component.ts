import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { SystemRoutingModule } from './app.routes';
import { HeaderComponent } from "./common-ui/header/header.component";
import { FooterComponent } from "./common-ui/footer/footer.component";
import { DiaryStatisticsComponent } from './forms/diary-statistics/diary-statistics.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, SystemRoutingModule, HeaderComponent, FooterComponent, DiaryStatisticsComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
   currentPage = ' ';

   changePage(page: string){
    this.currentPage = page;
   }
}
