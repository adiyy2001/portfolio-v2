interface WebpackContext {
  keys(): string[];
  <T>(id: string): T;
}

declare const require: {
  context(directory: string, deep: boolean, pattern: RegExp): WebpackContext;
};
