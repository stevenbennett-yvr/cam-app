

export interface FilterOption {
    title: string;
    type: 'MULTI-SELECT' | 'SELECT' | 'TRAITS-SELECT' | 'TEXT-INPUT' | 'NUMBER-INPUT' | 'CHECKBOX';
    key: string;
    options?: string[] | { label: string; value: string }[];
    isActionOption?: boolean
    filterFn?: (option: Record<string, any>) => boolean;
}

export interface FilterOptions {
    options: FilterOption[];
}

export interface SelectedFilter {
    filter: FilterOption;
    value: any;
  }