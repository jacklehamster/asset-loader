interface Config {
  waitBetweenLoader: number;
  retries: number;
  maxParallelLoad: number;
}

interface BlobRecord {
  url?: string;
  retried?: number;
  resolve?: (blob: BlobRecord) => void;
  failed?: boolean;
}

export class Loader {
  #config: Config;
  blobs: Record<string, BlobRecord> = {};
  loadingStack: string[] = [];
  loadingCount: number = 0;

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
  
  async getUrl(url: string): Promise<string> {
    return this.#getRecord(url).then(record => record?.url ?? url);
  }

  async load(url: string): Promise<void> {
    await this.#getRecord(url);
  }

  failed(url: string): boolean {
    return !!this.blobs[url].failed;
  }

  get progress(): number {
    const blobs = Object.values(this.blobs);
    return !blobs.length ? 0 : blobs.reduce((a, b) => a + (b.url ? 1 : 0), 0)
  }

  async #getRecord(url: string): Promise<BlobRecord> {
    if (this.blobs[url]) {
      //  bump priority
      this.loadingStack = [
        ...this.loadingStack.filter(u => u !== url),
        url,
      ];
      return this.blobs[url];
    }
    return new Promise<BlobRecord>((resolve) => {
      this.blobs[url] = {
        resolve,
      };
      this.loadingStack.push(url);
  
      this.#processQueue();
    });
  }

  #processQueue() {
    if (this.loadingCount < this.#config.maxParallelLoad) {
      const url = this.loadingStack.pop();
      if (url) {
        this.loadingCount++;
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
            this.loadingCount--;
            const record = this.blobs[url];
            const resolve = record.resolve;
            if (!blob) {
              //  failed load
              record.retried = (record.retried ?? 0) + 1;
              if (record.retried < this.#config.retries) {
                this.loadingStack.push(url);
              } else {
                record.failed = true;
                delete record.resolve;
                delete record.retried;
                resolve?.(record);
              }
            } else {
              const u = URL.createObjectURL(blob);
              delete record.resolve;
              delete record.retried;
              record.url = u;
              resolve?.(record);
            }
            setTimeout(() => this.#processQueue(), this.#config.waitBetweenLoader);
          });
      }
    }
  }

  revoke(url: string) {
    const u = this.blobs[url]?.url;
    if (u) {
      URL.revokeObjectURL(u);
      delete this.blobs[url];
    }
  }
}
