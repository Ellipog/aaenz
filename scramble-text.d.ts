declare module "scramble-text" {
  export interface ScrambleTextOptions {
    timeOffset?: number;
    chars?: string[];
    callback?: () => void;
  }

  export default class ScrambleText {
    constructor(element: Element, options?: ScrambleTextOptions);
    play(): this;
    start(): this;
    stop(): this;
  }
}

