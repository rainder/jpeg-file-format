import { exifTags } from '../tag-labels/exif-tags';
import { gpsTags } from '../tag-labels/gps-tags';
import { tiffTags } from '../tag-labels/tiff-tags';
import { suitch } from '../utils/suitch';
import { ParsedTag } from './index';
import { TagManager } from './tag-manager';

export class Tag<T = number[] | string[] | TagManager> {
  public tagId: number;
  public type: number;
  public rawValue: T;

  constructor(
    parsedTag: ParsedTag<T>,
  ) {
    this.tagId = parsedTag.tagId;
    this.rawValue = parsedTag.value;
    this.type = parsedTag.type;
  }

  get label(): string | undefined {
    return tiffTags[this.tagId] || exifTags[this.tagId] || gpsTags[this.tagId];
  }

  get value(): number | string | TagManager {
    // if ([0x8769, 0x8825, 0xA005].includes(this.tagId)) {
    if (this.rawValue instanceof TagManager) {
      return this.rawValue;
    }

    const value: any = this.rawValue;

    return suitch<number | string>(this.type, {
      2: () => (value).join(''),
      1: () => this.firstOrArray(value),
      3: () => this.firstOrArray(value),
      4: () => this.firstOrArray(value),
      5: () => this.firstOrArray(value),
      7: () => Buffer.from(value as number[]).toString(),
      10: () => this.firstOrArray(value),
    });
  }

  firstOrArray(value: any[]) {
    return value.length > 1 ? value : value[0];
  }

  setValue(value: any): this {
    this.rawValue = value;

    return this;
  }
}
