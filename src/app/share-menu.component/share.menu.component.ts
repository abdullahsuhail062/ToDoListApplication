import { Component } from "@angular/core";

@Component({
  selector: 'app-share-menu',
  standalone: true,
  templateUrl: './share-menu.component.html'
})
export class ShareMenuComponent {
  isOpen = false;
  url = window.location.href;

  toggle() {
    this.isOpen = !this.isOpen;
  }

  share(platform: 'facebook' | 'whatsapp') {
    const link =
      platform === 'facebook'
        ? `https://www.facebook.com/sharer/sharer.php?u=${this.url}`
        : `https://wa.me/?text=${this.url}`;

    window.open(link, '_blank');
    this.isOpen = false;
  }
}
