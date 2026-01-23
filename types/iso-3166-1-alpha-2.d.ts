declare module "iso-3166-1-alpha-2" {
	export function getCountry(code: string): string | undefined;
	export function getCode(country: string): string | undefined;
	export function getCodes(): string[];
	export function getCountries(): string[];
	export function getData(): Record<string, string>;
}
