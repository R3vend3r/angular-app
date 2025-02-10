import { Component } from '@angular/core';
import { WtpComponent } from "./wtp/wtp.component";
import { CnewpComponent } from "../../forms/cnewp/cnewp.component";
import { HeaderComponent } from "../../common-ui/header/header.component";
import { FooterComponent } from "../../common-ui/footer/footer.component";

@Component({
  selector: 'app-page-project',
  standalone: true,
  imports: [WtpComponent, CnewpComponent, HeaderComponent, FooterComponent],
  templateUrl: './page-project.component.html',
  styleUrl: './page-project.component.scss'
})

export class PageProjectComponent {
  openProjectsCount: number = 0;
  closedProjectsCount: number = 0;
  isOpen: boolean = true; // состояние, которое управляет отображением

  toggleForm(action: string) {
    if (action === 'open') {
      this.isOpen = true;
    } else if (action === 'close') {
      this.isOpen = false;
    }
  }

  // Методы для инкрементации счетчиков
  incrementOpenProjects() {
    this.openProjectsCount++;
  }

  incrementClosedProjects() {
    this.closedProjectsCount++;
  }
}
