import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface Table53B {
  [density: string]: {
    [temp: string]: number;
  };
}

@Injectable({ providedIn: 'root' })
export class ConverterService {
  private table?: Table53B;

  constructor(private http: HttpClient) {}

  async load(): Promise<void> {
    if (this.table) return;
    this.table = await firstValueFrom(
      this.http.get<Table53B>('assets/final_output.json')
    );
  }

  /** Direct lookup with optional rounding/interpolation. */
  convert(observedDensity: number, observedTemp: number): number {
    if (!this.table) throw new Error('Table not loaded');

    const densityKey = observedDensity.toFixed(1); // normalize to "670.0"
    const tempKey = observedTemp.toFixed(1);       // normalize to "20.5"
  
    const densityBlock = this.table[densityKey];
    if (!densityBlock) throw new Error(`Density ${observedDensity} not found in table`);

    const val = densityBlock[tempKey];
    if (val == null) throw new Error(`Temperature ${observedTemp} not found for density ${observedDensity}`);
  
    return this.round1(val);
  }

  private round1(n: number): number {
    return Math.round(n * 10) / 10;
  }
}
