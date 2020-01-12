import { Tag } from './tag';

export class TagManager {
  [key: number]: Tag<any>;

  [Symbol.iterator]!: () => Iterator<Tag<any>>;
  push!: (value: Tag<any>) => number;
  sort!: (comparator: (a: Tag, b: Tag) => number) => this;
  forEach!: (cb: (item: Tag) => void) => void;
  length!: number;

  constructor(
    public tags: Tag[],
  ) {
    return new Proxy(this, {
      get(target: TagManager, p: string | number | symbol, receiver: any): any {
        if (typeof p === 'string') {
          if (Number(p) >= 0) {
            return tags[p as any];
          }

          if (['push', 'sort', 'forEach'].includes(p)) {
            return (tags[p as any] as any).bind(tags);
          }

          if (['length'].includes(p)) {
            return tags[p as any];
          }
        }

        if (p === Symbol.iterator) {
          return tags[Symbol.iterator];
        }

        return target[p as any];
      },

    });
  }

  /**
   *
   * @param {number} id
   * @returns {Tag | null}
   */
  findTagById(id: number): Tag | null {
    for (const tag of this) {
      if (tag.tagId === id) {
        return tag;
      }
    }

    return null;
  }

  findOrCreateTAG<T>(id: number, type: number, creator?: () => T): Tag<T> {
    const existingTag = this.findTagById(id);

    if (existingTag) {
      return existingTag as Tag<any>;
    }

    const tag = new Tag<T>({
      tagId: id,
      type: type,
      value: creator ? creator() : [] as any,
    });

    this.push(tag);
    this.sort((a, b) => a.tagId - b.tagId);

    return tag;
  }
}
