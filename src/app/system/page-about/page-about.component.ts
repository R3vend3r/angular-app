import { Component } from '@angular/core';
import { HeaderComponent } from "../../common-ui/header/header.component";
import { FooterComponent } from "../../common-ui/footer/footer.component";
import { BackInfoComponent } from "../../forms/back-info/back-info.component";

@Component({
  selector: 'app-page-about',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, BackInfoComponent],
  templateUrl: './page-about.component.html',
  styleUrl: './page-about.component.scss'
})
export class PageAboutComponent {

}
