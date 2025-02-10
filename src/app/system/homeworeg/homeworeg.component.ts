import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from "../../common-ui/footer/footer.component";
import { HiStartComponent } from "./hi-start/hi-start.component";
import { AuthComponent } from "../../auth/auth.component";
import { RewiesComponent } from "../../forms/rewies/rewies.component";
import { DataService } from '../../shared/data.service';

@Component({
  selector: 'app-homeworeg',
  standalone: true,
  imports: [FooterComponent, HiStartComponent, AuthComponent, RouterOutlet, RouterLink, RouterLinkActive, CommonModule, FormsModule, RewiesComponent],
  templateUrl: './homeworeg.component.html',
  styleUrls: ['./homeworeg.component.scss'] // Исправлено на styleUrls
})
export class HomeworegComponent implements OnInit {
  isRegistering: boolean = false; // переменная для управления состоянием

  constructor(private router: Router,
              private dataService: DataService
  ) {}

  reviews: any[] = [];
  filteredReviews: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 3;
  totalPages: number = 0;

  ngOnInit() {
    this.fetchPublishedReviews(); // Метод для получения отзывов
  }

  fetchPublishedReviews() {
    this.dataService.getPublishedReviews().subscribe(reviews => {
      this.reviews = reviews;
      this.paginateReviews();
    });
  }

  paginateReviews() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.filteredReviews = this.reviews.slice(start, end);
    this.totalPages = Math.ceil(this.reviews.length / this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage < Math.ceil(this.reviews.length / this.itemsPerPage)) {
      this.currentPage++;
      this.paginateReviews();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginateReviews();
    }
  }
  scrollToReviews() {
    const reviewsElement = document.getElementById('reviews');
    if (reviewsElement) {
      reviewsElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
  
  toggleAuth() {
    this.router.navigate(['/auth']);
  }

  onRegisterSubmit() {
    // Логика после успешной регистрации
    console.log('Регистрация прошла успешно');
  }

  onLoginSubmit() {
    // Логика после успешного входа
    console.log('Вход прошел успешно');
  }
}