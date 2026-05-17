import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, ChocolateSelection } from '../../services/cart.service';
import { CatalogService, BoxSize } from '../../services/catalog.service';

@Component({
  selector: 'app-box-builder',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './box-builder.component.html',
  styleUrl: './box-builder.component.css'
})
export class BoxBuilderComponent implements OnInit {
  cartService = inject(CartService);
  catalogService = inject(CatalogService);

  boxSize = signal<'Chica' | 'Grande'>('Chica');
  baseFlavors = signal<string[]>([]);
  fillings = signal<string[]>([]);
  boxSizes = signal<BoxSize[]>([]);

  flavorImages: Record<string, string> = {
    'Dulce': 'assets/chocolate dulce.jpeg',
    'Amargo': 'assets/chocolate amargo.jpeg',
    'Blanco': 'assets/chocolate blanco.png'
  };

  fillingImages: Record<string, string> = {
    'Choco avellana': 'assets/chocolate relleno avellana.png',
    'Fresa': 'assets/chocolate relleno fresa.png',
    'Queso con zarzamora': 'assets/chocolate relleno zarzamora.png',
    'Almendra': 'assets/chocolate relleno almendra.png',
    'Mango': 'assets/chocolate relleno mango.jpeg'
  };

  selectedChocolates = signal<ChocolateSelection[]>([]);

  currentBoxData = computed(() => {
    const sizeName = this.boxSize();
    return this.boxSizes().find(b => b.name === sizeName) || { 
      capacity: sizeName === 'Chica' ? 6 : 12, 
      basePrice: sizeName === 'Chica' ? 15 : 25 
    };
  });

  maxChocolates = computed(() => 1);
  price = computed(() => this.currentBoxData().basePrice);

  ngOnInit() {
    this.catalogService.getCatalog().subscribe({
      next: (res) => {
        this.baseFlavors.set(res.flavors);
        this.fillings.set(res.fillings);
        this.boxSizes.set(res.boxSizes);
      },
      error: (err) => console.error('Error fetching catalog', err)
    });
  }

  setBoxSize(size: 'Chica' | 'Grande') {
    this.boxSize.set(size);
    // truncate if necessary
    if (this.selectedChocolates().length > this.maxChocolates()) {
      this.selectedChocolates.update(chocs => chocs.slice(0, this.maxChocolates()));
    }
  }

  addChocolate(baseFlavor: string, filling: string) {
    if (this.selectedChocolates().length < this.maxChocolates()) {
      this.selectedChocolates.update(chocs => [...chocs, { baseFlavor, filling }]);
    }
  }

  removeChocolate(index: number) {
    this.selectedChocolates.update(chocs => chocs.filter((_, i) => i !== index));
  }

  addToCart() {
    if (this.selectedChocolates().length === this.maxChocolates()) {
      this.cartService.addToCart({
        boxSize: this.boxSize(),
        chocolates: this.selectedChocolates(),
        price: this.price(),
        quantity: 1
      });
      // reset
      this.selectedChocolates.set([]);
    }
  }
}
