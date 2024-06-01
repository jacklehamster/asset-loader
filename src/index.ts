import { Loader } from "./loader/Loader";

const primaryLoader = new Loader();

export function uSync(url: string): string|undefined {
  return primaryLoader.getUrlSync(url);
}

export async function u(url: string): Promise<string> {
  return primaryLoader.getUrl(url);
}

export async function blob(url: string): Promise<Blob | undefined> {
  return primaryLoader.getBlob(url);
}

export async function revoke(url: string) {
  primaryLoader.revoke(url);
}

export { Loader };
