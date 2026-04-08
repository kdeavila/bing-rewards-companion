import type { TrendingTopic } from "../types";

interface HNHit {
  objectID: string;
  title: string | null;
  url: string | null;
}

interface HNResponse {
  hits: HNHit[];
}

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

export async function fetchTrendingTopics(page: number = 0): Promise<TrendingTopic[]> {
  try {
    // Using HN Algolia API to get recent top stories with pagination
    const response = await fetch(`https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=30&page=${page}`);
    const rawData: unknown = await response.json();
    const data = toHNResponse(rawData);
    
    return data.hits
      .filter((hit) => Boolean(hit.title))
      .map((hit) => ({
        id: hit.objectID,
        title: hit.title ?? "Untitled topic",
        url: hit.url ?? undefined,
      }));
  } catch (error) {
    console.error('Failed to fetch trending topics:', error);
    // Fallback topics
    return [
      { id: '1', title: 'SpaceX Starship Launch' },
      { id: '2', title: 'AI Breakthroughs 2026' },
      { id: '3', title: 'Sustainable Architecture' },
      { id: '4', title: 'Quantum Computing Status' },
      { id: '5', title: 'Renewable Energy Trends' }
    ];
  }
}
