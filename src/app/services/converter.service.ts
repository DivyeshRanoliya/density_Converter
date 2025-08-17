import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface Table53B {
  densities: number[]; // columns (observed density)
  temps: number[];     // rows (observed temperature)
  values: number[][];  // [row][col] => standard density @ 15°C
}

@Injectable({ providedIn: 'root' })
export class ConverterService {
  private table?: Table53B;

  constructor(private http: HttpClient) {}

  async load(): Promise<void> {
    if (this.table) return;
    this.table = await firstValueFrom(this.http.get<Table53B>('assets/table53b.json'));
  }

  /** Bilinear interpolation within the grid. */
  convert(observedDensity: number, observedTemp: number): number {
    if (!this.table) throw new Error('Table not loaded');
    const { densities: X, temps: Y, values: Z } = this.table;

    // ensure within bounds
    if (observedDensity < X[0] || observedDensity > X[X.length - 1]) {
      throw new Error(`Observed density out of range ${X[0]}–${X[X.length - 1]}`);
    }
    if (observedTemp < Y[0] || observedTemp > Y[Y.length - 1]) {
      throw new Error(`Temperature out of range ${Y[0]}–${Y[Y.length - 1]}`);
    }

    // find bounding indices for density (x) and temp (y)
    const xi = this.lowerIndex(X, observedDensity);
    const yi = this.lowerIndex(Y, observedTemp);

    // exact match shortcuts
    const x0 = X[xi], x1 = X[Math.min(xi + 1, X.length - 1)];
    const y0 = Y[yi], y1 = Y[Math.min(yi + 1, Y.length - 1)];

    const Q11 = Z[yi][xi];
    const Q21 = Z[yi][Math.min(xi + 1, X.length - 1)];
    const Q12 = Z[Math.min(yi + 1, Y.length - 1)][xi];
    const Q22 = Z[Math.min(yi + 1, Y.length - 1)][Math.min(xi + 1, X.length - 1)];

    // If we're exactly on grid lines
    if (observedDensity === x0 && observedTemp === y0) return Q11;
    if (x1 === x0 && y1 === y0) return Q11; // degenerate
    if (y1 === y0) { // linear in x
      const t = (observedDensity - x0) / (x1 - x0);
      return this.round1(Q11 + t * (Q21 - Q11));
    }
    if (x1 === x0) { // linear in y
      const u = (observedTemp - y0) / (y1 - y0);
      return this.round1(Q11 + u * (Q12 - Q11));
    }

    // bilinear interpolation
    const t = (observedDensity - x0) / (x1 - x0);
    const u = (observedTemp - y0) / (y1 - y0);

    const R1 = Q11 + t * (Q21 - Q11);
    const R2 = Q12 + t * (Q22 - Q12);
    const P  = R1 + u * (R2 - R1);

    return this.round1(P);
  }

  /** index i such that arr[i] <= v <= arr[i+1] */
  private lowerIndex(arr: number[], v: number): number {
    let lo = 0, hi = arr.length - 1;
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (arr[mid] === v) return mid;
      if (arr[mid] < v) lo = mid + 1; else hi = mid;
    }
    return Math.max(0, lo - (arr[lo] > v ? 1 : 0));
  }

  private round1(n: number): number {
    return Math.round(n * 10) / 10; // match table precision
  }
}
