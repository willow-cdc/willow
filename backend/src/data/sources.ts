interface Source {
  name: string;
}

interface SourceManager {
  sources: Source[];
  find: (name: string) => Source | undefined;
  add: (name: string) => Source;
  delete: (name: string) => Source | undefined;
  getAll: () => Source[];
}

export const sources: SourceManager  = {
  sources: [], 
  find(name: string) {
    const source = this.sources.find(s => s.name === name);
    return source;
  },
  add(name: string) {
    const exists = !!this.find(name);
    if (exists) {
      throw Error(`Source ${name} already exists.`);
    } 

    const source = {name};
    this.sources.push(source);
    return source;
  },
  delete(name: string) {
    const source = this.find(name);
    if (source) {
      this.sources = this.sources.filter(s => s.name !== name);
    }
    return source;
  },
  getAll() {
    return this.sources;
  },
};