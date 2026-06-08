export const CATALOG_CATEGORIES = ['Пицца', 'Комбо', 'Десерты', 'Закуски', 'Напитки'] as const;

export const ALL_CATEGORY = 'Все' as const;

export type CatalogCategory = (typeof CATALOG_CATEGORIES)[number];
