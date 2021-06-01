export class Constants {
  static readonly encoding = "utf-8"
  static readonly maxLinesToWrite = 1e5
  static readonly filePath = process.env.HOME + "/Downloads/large-file.txt"
  static readonly compressedFilePath = process.env.HOME + "/Downloads/large-file.gzip"
}

export enum ConsoleLogSkip {
  WriteLargeFileEfficiently = 1_000,
  WriteLargeFileInefficiently = 1_000,
  ReadLargeFileEfficientlyBytesRead = 10_000_000,
  DummyOutputStreamCharsWritten = 5_000,
}
