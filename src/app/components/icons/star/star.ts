import { Component, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-star',
  imports: [],
  templateUrl: './star.html',
  standalone: true,
  styleUrl: './star.css',
})
export class StarIcon implements OnInit {
  active = signal<boolean>(false);

  // animate on mount
  ngOnInit(): void {
    setTimeout(() => {
      this.active.set(true);
    }, 100);
    console.log('init star');
  }
}
