import { writable } from 'svelte/store';

export const currentPageTitle = writable<string>('');
