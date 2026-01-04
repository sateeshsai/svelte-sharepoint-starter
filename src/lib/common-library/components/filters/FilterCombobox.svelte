<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import ChevronsUpDown from '@lucide/svelte/icons/chevrons-up-down';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';

	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';
	import { tick } from 'svelte';

	let {
		filters,
		placeholder,
		selected
	}: { filters: string[]; placeholder: string; selected: string } = $props();

	let open = $state(false);
	let value = '';

	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger(triggerId: string) {
		open = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}
</script>

<!-- <div class="filterComboboxWrapper grid w-fit content-start gap-2 rounded-md text-sm"> -->
<!-- <h3 class="font-bold text-foreground/50">{filterLabel}</h3> -->
<Popover.Root bind:open>
	<Popover.Trigger>
		<Button
			variant="outline"
			role="combobox"
			aria-expanded={open}
			class="h-auto w-[20ch] justify-between truncate overflow-hidden px-2 py-1  text-sm"
		>
			{selected}
			<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-fit p-2">
		<Command.Root>
			<Command.Input placeholder="Search..." />
			<Command.List>
				<Command.Empty>No results found.</Command.Empty>
				<Command.Group heading="Options">
					{#each filters as filter}
						<Command.Item
							onSelect={() => {
								selected = filter;
								open = false;
							}}
							value={filter}
						>
							<Check class={cn(' h-4 w-4', selected !== filter && 'text-transparent')} />
							{filter}
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
<!-- </div> -->
