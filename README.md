# asset-loader

[![npm version](https://badge.fury.io/js/@dobuki%2Fasset-loader.svg)](https://www.npmjs.com/package/@dobuki/asset-loader) [![Version](https://img.shields.io/github/v/release/jacklehamster/asset-loader)](https://github.com/jacklehamster/asset-loader) [![License](https://img.shields.io/github/license/jacklehamster/asset-loader)](https://github.com/jacklehamster/asset-loader)

![icon](icon.png)

## Description

The asset loader is a package used for preloading assets for your app or game. The idea is this:

- We first list all assets that we plan to load and keep in memory. The loading process is going to start, limited at 3 parallel downloads. You don't need to wait for all assets to download, you can already start the app.
- Whenever your app needs an asset from a URL, pass it as `await loader.getUrl(url)` instead of `url`. This will wait ensure that the asset for that URL is downloaded, and it will replace the URL with the BLOB url. The blob URL is the equivalent URL saved in memory, so you won't be hitting the server again.
- The download process could take a while, and there are assets you don't need immediately. But as soon as an asset is needed, its download gets reprioritized to the top. There is also a `priority` parameter you can pass to ensure your download gets higher priority:
  - LOW: New requests do not get re-prioritized.
  - MEDIUM: New requests get prioritized, but not above the 3 simultaneous download limits.
  - HIGH (default if no priority specified): New request initiate immediately and the limit can go up to 4 simultaneous downloads.
  - TOP: New request initiate immediately and the download limit is disregarded.

## Usage

### Preloading

Instantiate the loader, then preload all assets you will eventually need.

```typescript
const loader = new Loader();
loader.load(url1);
loader.load(url2);
loader.load(url3);
//...
```

Note that `loader.load` return a promise, but we don't put `await` because we're not waiting for those to finish.

### Fetch asset on demand

Then your app will need some assets immediately:

```typescript
const assetToShow = await loader.getUrl(url);
const img = new Image();
img.src = assetToShow;
```

The URL you're passing to `img.src` will be a blob URL, which is shown immediately if the asset is in memory, or will wait for the `await` otherwise. Since you'll be progressively downloading all assets, they will eventually all be available immediately.

### Configure

You can change the configuration when instantiating the loader:

```typescript
const loader = new Loader({
  waitBetweenLoader: 1000,  //  default 10
  retries: 5,               //  default 3
  maxParallelLoad: 5,       //  default 3
});
```

- `waitBeetweenLoader`: Millisecs to wait before initiating a new download after the first 3.
- `retries`: If the download fails, try again 3 times.
- `maxParallelLoad`: At most 3 simultaneous downloads, but you can change that.

## Demo

Below is a demo on [@dobuki/asset-loader](https://www.npmjs.com/package/@dobuki/asset-loader) being used to load all assets within a Github repo.

Click [here](https://jacklehamster.github.io/asset-loader/docs) to view example.
