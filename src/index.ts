import { Loader } from "./loader/Loader";

const primaryLoader = new Loader();

function uSync(url: string): string|undefined {
  return primaryLoader.getUrlSync(url);
}

async function u(url: string): Promise<string> {
  return primaryLoader.getUrl(url);
}

async function blob(url: string): Promise<Blob | undefined> {
  return primaryLoader.getBlob(url);
}

async function revoke(url: string) {
  primaryLoader.revoke(url);
}

export { Loader, uSync, u, blob, revoke };
