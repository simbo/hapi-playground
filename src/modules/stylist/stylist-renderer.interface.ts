import { StylistOptions } from './stylist-options.interface';
import { StylistSource } from './stylist-source.interface';

export interface StylistRenderer {
  type: string;
  render(source: StylistSource, options: StylistOptions): Promise<string>;
}
