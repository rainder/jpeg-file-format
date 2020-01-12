import { suitch } from '../utils/suitch';
import { Coder } from './coders';
import { tag1Coder } from './coders/type-1';
import { tag10Coder } from './coders/type-10';
import { tag2Coder } from './coders/type-2';
import { tag3Coder } from './coders/type-3';
import { tag4Coder } from './coders/type-4';
import { tag5Coder } from './coders/type-5';
import { tag7Coder } from './coders/type-7';
import { TagManager } from './tag-manager';

export const TIFF_FLAG_BIG_END = Buffer.from('4D4D', 'hex');
export const TIFF_FLAG_LITTLE_END = Buffer.from('4949', 'hex');
export const TIFF_FLAG_MARKER = Buffer.from('002A', 'hex');

export interface ParsedTag<T = TagManager | string[] | number[]> {
  tagId: number;
  type: number;
  value: T;
}

export const getTagCoder = (type: number) => suitch<Coder<any>>(type, {
  [1]: () => tag1Coder,
  [2]: () => tag2Coder,
  [3]: () => tag3Coder,
  [4]: () => tag4Coder,
  [5]: () => tag5Coder,
  [7]: () => tag7Coder,
  [10]: () => tag10Coder,
});
