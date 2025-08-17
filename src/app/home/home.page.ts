import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ConverterService } from '../services/converter.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit {
  observedTemp: number | null = null;
  observedDensity: number | null = null;
  result: number | null = null;
  rangeNote = '';

  constructor(
    private converter: ConverterService,
    private toastCtrl: ToastController
  ) {}

  async ngOnInit() {
    try {
      await this.converter.load();
    } catch (e: any) {
      this.presentToast(`Failed to load table: ${e.message || e}`);
    }
  }

  async onConvert() {
    this.result = null;
    this.rangeNote = '';

    if (this.observedTemp === null || this.observedDensity === null) {
      return this.presentToast('Enter both temperature and density');
    }

    try {
      const val = this.converter.convert(this.observedDensity, this.observedTemp);
      this.result = val;
      this.rangeNote = 'Interpolated from ASTM 53B grid.';
    } catch (e: any) {
      this.presentToast(e.message || 'Conversion error');
    }
  }

  private async presentToast(message: string) {
    const t = await this.toastCtrl.create({ message, duration: 1800, position: 'bottom' });
    await t.present();
  }
}
