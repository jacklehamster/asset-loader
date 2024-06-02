import { Loader } from "./loader/Loader";

const primaryLoader = new Loader();

function uSync(url: string): string|undefined {
  return primaryLoader.getUrlSync(url);
}

async function u(url: string): Promise<string> {
  return primaryLoader.getUrl(url);
}

function revoke(url: string) {
  primaryLoader.revoke(url);
}

export { Loader, uSync, u, revoke };
