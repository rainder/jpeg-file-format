import { TagManager } from '../tiff-parser/tag-manager';
import { tagsToTiff } from '../tiff-parser/tags-to-tiff';
import { EXIF_IFD_POINTER_MARKER, GPS_INFO_IFD_POINTER_MARKER, tiffToTags } from '../tiff-parser/tiff-to-tags';
import BufferReader from '../utils/buffer-reader';
import { numberToBuffer } from '../utils/buffer-utils';
import { Segment } from './types';

export const EXIF_HEADER = Buffer.from('457869660000', 'hex');

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export default class ExifSegment implements Segment {
  tagManager: TagManager;

  constructor(
    public id: number,
    data: Buffer,
  ) {
    const reader = new BufferReader(data);

    if (reader.readBytes(6).compare(EXIF_HEADER)) {
      throw new Error('invalid EXIF header');
    }

    this.tagManager = tiffToTags(reader.remaining());
  }

  get data() {
    return Buffer.concat([
      EXIF_HEADER,
      tagsToTiff(this.tagManager, true),
    ]);
  }

  setGPSLocation(coordinate: Coordinate): this {
    const toDMS = (value: number) => {
      const d = Math.floor(value);
      const m = Math.floor((value - d) * 60);
      const s = (value - d - m / 60) * 3600;

      return [d, m, s];
    };

    const latitudeDMS = toDMS(Math.abs(coordinate.latitude));
    const longitudeDMS = toDMS(Math.abs(coordinate.longitude));
    const latitudeRef = coordinate.latitude >= 0 ? 'N' : 'S';
    const longitudeRef = coordinate.longitude >= 0 ? 'E' : 'W';

    const gpsTag = this.tagManager.findOrCreateTAG(GPS_INFO_IFD_POINTER_MARKER, 4, () => new TagManager([]));
    gpsTag.rawValue.findOrCreateTAG(1, 2).setValue([latitudeRef, 0x00.toString()]);
    gpsTag.rawValue.findOrCreateTAG(2, 5).setValue(latitudeDMS);
    gpsTag.rawValue.findOrCreateTAG(3, 2).setValue([longitudeRef, 0x00.toString()]);
    gpsTag.rawValue.findOrCreateTAG(4, 5).setValue(longitudeDMS);

    return this;
  }

  getGPSLocation(): Coordinate | null {
    const gpsInfoTag = this.tagManager.findTagById(GPS_INFO_IFD_POINTER_MARKER);

    if (!gpsInfoTag || !(gpsInfoTag.rawValue instanceof TagManager)) {
      return null;
    }

    const gpsTagsManager: TagManager = gpsInfoTag.rawValue;
    const getTag = <T>(id: number): T[] => {
      const tag = gpsTagsManager.findTagById(id);

      if (!tag || tag.rawValue instanceof TagManager) {
        throw new Error('tag not found');
      }

      return tag.rawValue as any;
    };
    const toNumber = (ref: string, [d, m, s]: number[]) => {
      return (['W', 'S'].includes(ref) ? -1 : 1) * (d + m / 60 + s / 3600);
    };

    const latitude = toNumber(getTag<string>(1)[0], getTag<number>(2));
    const longitude = toNumber(getTag<string>(3)[0], getTag<number>(4));

    return {
      latitude,
      longitude,
    };
  }

  setMakerNote(value: number[]): this {
    const exifTag = this.tagManager.findOrCreateTAG(EXIF_IFD_POINTER_MARKER, 4, () => new TagManager([]));
    exifTag.rawValue.findOrCreateTAG(37500, 7).setValue(value);

    return this;
  }

  getMakerNote(): Buffer | null {
    const exifTag = this.tagManager.findTagById(EXIF_IFD_POINTER_MARKER);

    if (!exifTag || !(exifTag.rawValue instanceof TagManager)) {
      return null;
    }

    const tag: TagManager = exifTag.rawValue;
    const makerNoteTag = tag.findTagById(37500);

    if (!makerNoteTag) {
      return null;
    }

    return Buffer.from(makerNoteTag.rawValue as any);
  }

  getUserComment(): string | null {
    const exifTag = this.tagManager.findTagById(EXIF_IFD_POINTER_MARKER);

    if (!exifTag || !(exifTag.rawValue instanceof TagManager)) {
      return null;
    }

    const tag = exifTag.rawValue.findTagById(37510);

    if (!tag || !Array.isArray(tag.rawValue)) {
      return null;
    }

    return Buffer.from(tag.rawValue.slice(8) as number[]).toString();
  }

  setUserComment(value: string): this {
    const exifTag = this.tagManager.findOrCreateTAG(EXIF_IFD_POINTER_MARKER, 4, () => new TagManager([]));
    exifTag.rawValue.findOrCreateTAG(37510, 7).setValue(
      Array.from(Buffer.concat([
        // Buffer.from('554E49434F444500', 'hex'), //UNICODE
        Buffer.from('4153434949000000', 'hex'), //ASCII
        Buffer.from(value),
      ])),
    );

    return this;
  }

  toBuffer() {
    const data = this.data;

    return Buffer.concat([
      numberToBuffer(1, 0xFF, true),
      numberToBuffer(1, this.id, true),
      numberToBuffer(2, data.length + 2, true),
      data,
    ]);
  }
}
