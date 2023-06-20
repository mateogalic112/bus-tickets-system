export interface InfiniteScrollResponse<T> {
  items: T[];
  nextCursor: { id: number } | null;
}
