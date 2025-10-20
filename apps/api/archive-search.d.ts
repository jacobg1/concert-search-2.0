declare module 'archive-search' {
  import type {
    ArchiveSearchOptions,
    ConcertResponse,
    SearchResponse,
  } from './src/interface'

  export const archiveSearch: {
    search: (term: string, opt: ArchiveSearchOptions) => Promise<SearchResponse>
    metaSearch: (id: string) => Promise<ConcertResponse>
    searchBaseUrl: string
    metaBaseUrl: string
  }
}
