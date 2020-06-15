import fs from 'fs-extra';
import {Parser} from './parser';

interface MochaSource {
  fullFile: string;
  tests: {
    fullTitle: string;
  }[];
  suites: MochaSource[];
}

interface FileSource {
  results: MochaSource[];
}

export class MochaParser extends Parser {
  source: FileSource | null;

  constructor(path: string) {
    super(path);
    this.source = null;
  }

  private readFile() {
    // console.log('Parsing source files: %j', this.path);

    let source = '';
    try {
      source = fs.readFileSync(this.path, 'utf-8');
    } catch (err) {
      console.error(`Unable to read and parse the source file ${this.path}: ${err}`);
    }

    this.source = JSON.parse(source);
  }

  parser() {
    this.readFile();
    if (!this.source) {
      throw new Error('parser mocha source fail');
    }

    const queue = [this.source.results[0]];

    while (queue.length !== 0) {
      const item = queue.shift();
      if (!item) {
        continue;
      }

      for (const child of item.suites) {
        for (const testItem of child.tests) {
          this.map.set(`${child.fullFile} ${testItem.fullTitle}`, {
            ...testItem,
          });
        }

        queue.push(child);
      }
    }

    return this.map;
  }
}
