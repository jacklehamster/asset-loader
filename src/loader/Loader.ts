import { Priority } from "./Priority";

interface Config {
  waitBetweenLoader: number;
  retries: number;
  maxParallelLoad: number;
}

interface BlobRecord {
  url?: string;
  retried?: number;
  resolve?: (blob: BlobRecord) => void;
  promise?: Promise<string|undefined>;
  failed?: boolean;
  canceled?: boolean;
  fetching?: boolean;
}

export class Loader {
  #config: Config;
  readonly blobs: Record<string, BlobRecord> = {};
  loadingStack: string[] = [];
  loadingCount: number = 0;

  static mainLoader = new Loader();

  constructor(config: Partial<Config> = {}) {
    this.#config = {
      //  default
      waitBetweenLoader: 10,
      retries: 3,
      maxParallelLoad: 3,
      //  config
      ...config,
    };
  }

  getUrlSync(url: string): string | undefined {
    return this.blobs[url]?.url;
  }
  
  getUrl(url: string, priority: Priority = Priority.HIGH): Promise<string | undefined> {
    const record = this.#getRecord(url, priority);
    return record.promise ?? Promise.resolve(record.url);
  }

  load(url: string, priority: Priority =  Priority.HIGH): Promise<string | undefined> {
    return this.getUrl(url, priority);
  }

  failed(url: string): boolean {
    return !!this.blobs[url].failed;
  }

  remove(url: string): void {
    this.loadingStack = this.loadingStack.filter(u => url!==u);
    this.#revoke(url);
    const b = this.blobs[url];
    this.#resolveRecord(b);
  }

  clear() {
    Object.keys(this.blobs).forEach(u => this.remove(u));
  }

  get progress(): number {
    const blobs = Object.values(this.blobs);
    return !blobs.length ? 0 : blobs.reduce((a, b) => a + (b.url ? 1 : 0), 0)
  }

  #startFetching(record: BlobRecord) {
    if (!record.fetching) {
      record.fetching = true;
      this.loadingCount++;
    }
  }

  #stopFetching(record: BlobRecord) {
    if (record.fetching) {
      delete record.fetching;
      this.loadingCount--;
      setTimeout(() => this.#processQueue(Priority.MEDIUM), this.#config.waitBetweenLoader);
    }
  }

  #revoke(url: string) {
    const b = this.blobs[url];
    const u = b?.url;
    if (u) {
      URL.revokeObjectURL(u);
    }
    delete b.url;
  }

  #getRecord(url: string, priority: Priority): BlobRecord {
    if (this.blobs[url]) {
      if (this.loadingStack.indexOf(url) >= 0) {
        if (priority === Priority.LOW) {
          //  deprioritize
          this.loadingStack = [
            url,
            ...this.loadingStack.filter(u => u !== url),
          ];
          this.#processQueue(priority);
        } else {
          //  bump priority
          this.loadingStack = [
            ...this.loadingStack.filter(u => u !== url),
            url,
          ];
          this.#processQueue(priority);
        }
      }
      return this.blobs[url];
    }
    this.blobs[url] = {};
    const promise  = new Promise<BlobRecord>((resolve) => {
      this.blobs[url].resolve = resolve;
      this.loadingStack.push(url);
      this.#processQueue(priority);
    });
    this.blobs[url].promise = promise.then(b => b.url);
    return this.blobs[url];
  }

  #resolveRecord(b: BlobRecord) {
    const resolve = b.resolve;
    delete b.resolve;
    delete b.retried;
    this.#stopFetching(b);
    resolve?.(b);
  }

  #processQueue(priority: Priority) {
    if (this.loadingCount < this.#config.maxParallelLoad 
      || priority === Priority.HIGH && this.loadingCount < this.#config.maxParallelLoad + 1
      || priority === Priority.TOP) {
      const url = this.loadingStack.pop();
      const b = url ? this.blobs[url] : undefined;
      if (url && b && !b.fetching && !b.url) {
        this.#startFetching(b);
        fetch(url)
          .then(r => r.blob())
          .then(blob => {
            const split = url.split(".");
            const ext = split[split.length - 1].toLowerCase();
            switch (ext) {
              case "mp3":
              case "ogg":
                if (blob.type.indexOf("audio/") !== 0) {
                  return;
                }
                break;
              case "svg":
              case "gif":
              case "png":
              case "jpg":
              case "jpeg":
                if (blob.type.indexOf("image/") !== 0) {
                  return;
                }
                break;
              case "json":
                if (blob.type.indexOf("application/json") !== 0) {
                  return;
                }
                break;
            }
            return blob;
          })
          .then(blob => {
            if (!blob) {
              //  failed load
              b.retried = (b.retried ?? 0) + 1;
              if (b.retried < this.#config.retries) {
                this.loadingStack.push(url);
              } else {
                b.failed = true;
                this.#resolveRecord(b);
              }
            } else {
              b.url = URL.createObjectURL(blob);
              this.#resolveRecord(b);
            }
            this.#stopFetching(b);
          });
      }
    }
  }
}
