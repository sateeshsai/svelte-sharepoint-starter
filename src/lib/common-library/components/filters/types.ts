export interface Filter {
	[key: string]: {
		filters: string[];
		selected: string | undefined;
		description: string;
	};
}
