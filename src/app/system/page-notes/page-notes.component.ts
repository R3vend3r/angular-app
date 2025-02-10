import { Component } from '@angular/core';
import { HeaderComponent } from "../../common-ui/header/header.component";
import { FooterComponent } from "../../common-ui/footer/footer.component";

@Component({
  selector: 'app-page-notes',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './page-notes.component.html',
  styleUrl: './page-notes.component.scss'
})
export class PageNotesComponent {

}
