import type { TrendingTopic } from "../types";

interface HNHit {
  objectID: string;
  title: string | null;
  url: string | null;
}

interface HNResponse {
  hits: HNHit[];
}

const DAILY_LIMIT = 20;
const BING_STAR_LIMIT = 25;

const DAILY_FALLBACK_TOPICS: TrendingTopic[] = [
  { id: "daily-1", title: "Latest AI tools for productivity" },
  { id: "daily-2", title: "Top open source projects 2026" },
  { id: "daily-3", title: "Best VS Code extensions for developers" },
  { id: "daily-4", title: "How to improve web performance" },
  { id: "daily-5", title: "React best practices for scalability" },
  { id: "daily-6", title: "What is new in TypeScript" },
  { id: "daily-7", title: "Cloud security trends this year" },
  { id: "daily-8", title: "Modern CSS layout techniques" },
  { id: "daily-9", title: "How large language models work" },
  { id: "daily-10", title: "Productivity habits for engineers" },
  { id: "daily-11", title: "Best practices for API design" },
  { id: "daily-12", title: "Frontend accessibility checklist" },
  { id: "daily-13", title: "Kubernetes for beginners" },
  { id: "daily-14", title: "JavaScript performance tips" },
  { id: "daily-15", title: "Cybersecurity news today" },
  { id: "daily-16", title: "How to write cleaner code" },
  { id: "daily-17", title: "DevOps automation examples" },
  { id: "daily-18", title: "New database technologies" },
  { id: "daily-19", title: "System design interview practice" },
  { id: "daily-20", title: "Tech startup trends 2026" },
];

const BING_STAR_FALLBACK_TOPICS: TrendingTopic[] = [
  ...DAILY_FALLBACK_TOPICS,
  { id: "star-21", title: "Latest product launches in tech" },
  { id: "star-22", title: "Engineering leadership insights" },
  { id: "star-23", title: "Machine learning use cases today" },
  { id: "star-24", title: "Interesting open source repositories" },
  { id: "star-25", title: "What developers are reading now" },
];

const isHNHit = (value: unknown): value is HNHit => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.objectID === "string" &&
    (typeof candidate.title === "string" || candidate.title === null) &&
    (typeof candidate.url === "string" || candidate.url === null)
  );
};

const toHNResponse = (value: unknown): HNResponse => {
  if (!value || typeof value !== "object") {
    return { hits: [] };
  }

  const maybeResponse = value as Record<string, unknown>;
  const maybeHits = maybeResponse.hits;
  if (!Array.isArray(maybeHits)) {
    return { hits: [] };
  }

  return {
    hits: maybeHits.filter(isHNHit),
  };
};

const toTopics = (hits: HNHit[]): TrendingTopic[] => {
  return hits
    .filter((hit) => Boolean(hit.title))
    .map((hit) => ({
      id: hit.objectID,
      title: hit.title ?? "Untitled topic",
      url: hit.url ?? undefined,
    }));
};

const uniqueByTitle = (topics: TrendingTopic[]): TrendingTopic[] => {
  const seen = new Set<string>();
  const result: TrendingTopic[] = [];

  for (const topic of topics) {
    const key = topic.title.trim().toLowerCase();
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    result.push(topic);
  }

  return result;
};

const rotateByDay = (topics: TrendingTopic[]): TrendingTopic[] => {
  if (topics.length === 0) {
    return topics;
  }

  const day = new Date().getDate();
  const offset = day % topics.length;
  return [...topics.slice(offset), ...topics.slice(0, offset)];
};

async function fetchHN(path: string): Promise<HNResponse> {
  const response = await fetch(`https://hn.algolia.com/api/v1/${path}`);
  const rawData: unknown = await response.json();
  return toHNResponse(rawData);
}

export async function fetchBingStarTopics(
  page: number = 0,
  limit: number = BING_STAR_LIMIT,
): Promise<TrendingTopic[]> {
  try {
    const data = await fetchHN(`search?tags=front_page&hitsPerPage=${limit}&page=${page}`);
    return toTopics(data.hits);
  } catch (error) {
    console.error("Failed to fetch Bing Star topics:", error);
    return BING_STAR_FALLBACK_TOPICS.slice(0, limit);
  }
}

export async function fetchDailyTopics(): Promise<TrendingTopic[]> {
  try {
    const [stories, asks] = await Promise.all([
      fetchHN("search_by_date?tags=story&hitsPerPage=50&page=0"),
      fetchHN("search_by_date?tags=ask_hn&hitsPerPage=30&page=0"),
    ]);

    const merged = uniqueByTitle([...toTopics(stories.hits), ...toTopics(asks.hits)]);
    const rotated = rotateByDay(merged);
    return rotated.slice(0, DAILY_LIMIT);
  } catch (error) {
    console.error("Failed to fetch Daily topics:", error);
    return rotateByDay(DAILY_FALLBACK_TOPICS).slice(0, DAILY_LIMIT);
  }
}

export async function fetchTrendingTopics(page: number = 0): Promise<TrendingTopic[]> {
  return fetchBingStarTopics(page);
}
