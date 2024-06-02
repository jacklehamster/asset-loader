import { describe, it, expect, beforeEach, jest } from 'bun:test';
import { Loader } from '../src';

describe("hello world", () => {
  let response: { json?: () => Promise<any>, text?: () => Promise<string>, blob?: () => Promise<Blob> } = {};  
  beforeEach(() => {
    global.fetch = jest.fn(() => Promise.resolve(response)) as unknown as jest.Mock;    
    global.URL.createObjectURL = jest.fn(() => "[blob-url]");
    (fetch as jest.Mock).mockClear();
  });

  function mockResponse(r: { json?: any, text?: string, blob?: Blob }) {
    response = {
      json: r.json ? () => Promise.resolve(r.json) : undefined,
      text: r.text ? () => Promise.resolve(r.text!) : undefined,
      blob: r.blob ? () => Promise.resolve(r.blob!) : undefined,
    };
    global.fetch = jest.fn(() => Promise.resolve(response)) as unknown as jest.Mock;    
  }

  it('should show hello', async () => {
    mockResponse({ json: {
      message: "Hello, world!",
    }});
    const res = await fetch("https://google.com");
    const data = await res.json();
    expect(data).toEqual({ message: 'Hello, world!' });
  });

  it('should fetch a single element', async () => {
    mockResponse({ blob: new Blob(["testing"]) });
    
    const loader = new Loader()
    expect(await loader.getUrl("https://test-url.com")).toEqual("[blob-url]");
  });
});
