import type { ProductListSearchQuery } from "@/gql/graphql";

const NO_MATCH = 0;
const EXACT_MATCH = 5;
const EXACT_WORD_MULTIPLIER = 2;

// https://stackoverflow.com/a/9310752
function escapeRegExp(text: string) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

function simpleSearchMatch(query: string, value: null | undefined | string): number {
	if (!value) {
		return NO_MATCH;
	}
	if (value === query) {
		return EXACT_MATCH;
	}

	const allWords = value.split(" ").length || 1;
	const exactRegExp = new RegExp(`\\b${query}\\b`, "ig");
	const includesRegExp = new RegExp(query, "ig");

	const exactWordOccurrences = [...value.toString().matchAll(exactRegExp)].length;
	const includesOccurrences = [...value.toString().matchAll(includesRegExp)].length;
	return (EXACT_WORD_MULTIPLIER * exactWordOccurrences + includesOccurrences) / allWords;
}

export function simpleSearch(products: ProductListSearchQuery["products"], query: string) {
	const escapedQuery = escapeRegExp(query);
	const productsEdges = products?.edges || [];
	const matches = productsEdges
		.flatMap((product) => {
			const fieldsWithWeights = [
				[product?.node?.name, 1.5],
				[product?.node?.slug, 1],
			] as const;

			const score = fieldsWithWeights
				.map(([field, weight]) => {
					return weight * simpleSearchMatch(escapedQuery, field);
				})
				.reduce((score, match) => score + match, 0);

			if (score > 0) {
				return { id: product.node.id, score };
			}
			return [];
		})
		.sort((a, b) => {
			return b.score - a.score;
		});

	return matches;
}
