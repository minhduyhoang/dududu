export class ColumnNumberTransformer {
  public to(data: number): number {
    return data;
  }

  public from(data: string): number {
    return parseInt(data);
  }
}
