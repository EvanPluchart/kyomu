export interface OpdsEntry {
  id: string;
  title: string;
  updated: string;
  author?: string;
  summary?: string;
  links: OpdsLink[];
}

export interface OpdsLink {
  href: string;
  type: string;
  rel?: string;
}

export interface OpdsFeed {
  id: string;
  title: string;
  updated: string;
  entries: OpdsEntry[];
  links: OpdsLink[];
}
