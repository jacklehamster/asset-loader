import { describe, it } from "bun:test";
import { greet } from "../src";

describe("hello world", () => {
  it('should show hello', () => {
    console.log(greet("World"));
  });
});
