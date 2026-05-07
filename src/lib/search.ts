import { SEARCH_INDEX, SearchEntity, EntityType } from "./searchIndex";

export function performSearch(query: string): SearchEntity[] {
  if (!query || query.trim() === "") {
    return [];
  }
  
  const lowerQuery = query.toLowerCase();
  
  return SEARCH_INDEX.filter((entity) => {
    return (
      entity.id.toLowerCase().includes(lowerQuery) ||
      entity.name.toLowerCase().includes(lowerQuery)
    );
  });
}

export type GroupedResults = Record<EntityType, SearchEntity[]>;

export function groupResults(results: SearchEntity[]): GroupedResults {
  const grouped = results.reduce((acc, entity) => {
    if (!acc[entity.type]) {
      acc[entity.type] = [];
    }
    acc[entity.type].push(entity);
    return acc;
  }, {} as GroupedResults);

  // Limit to max 3 per group as per requirements
  const limitedGrouped: Partial<GroupedResults> = {};
  for (const type of Object.keys(grouped) as EntityType[]) {
    limitedGrouped[type] = grouped[type].slice(0, 3);
  }

  return limitedGrouped as GroupedResults;
}

/**
 * Helper to flatten grouped results back into a 1D array for keyboard navigation
 */
export function flattenGroupedResults(grouped: GroupedResults): SearchEntity[] {
  const flat: SearchEntity[] = [];
  const order: EntityType[] = ["PROJECTS", "CLIENTS", "INVOICES", "TASKS", "LEADS"];
  
  for (const type of order) {
    if (grouped[type]) {
      flat.push(...grouped[type]);
    }
  }
  
  return flat;
}
