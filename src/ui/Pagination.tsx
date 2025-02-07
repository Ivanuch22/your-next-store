
import clsx from "clsx";
import Link from "next/link";

export async function Pagination({
	pageInfo,
}: {
	pageInfo: {
		__typename?: "PageInfo" | undefined;
		hasPreviousPage?: boolean | undefined;
		startCursor?: string | null | undefined;
		endCursor?: string | null | undefined;
		hasNextPage: boolean;
	} | undefined
}) {
	return (
		<nav className="flex items-center justify-center gap-x-4 border-neutral-200 px-4 pt-12">
			<Link
				href={pageInfo?.hasNextPage ? `?cursor=${pageInfo?.endCursor}` : "#"}
				className={clsx("px-4 py-2 text-sm font-medium ", {
					"rounded bg-neutral-900 text-neutral-50 hover:bg-neutral-800": pageInfo?.hasNextPage,
					"cursor-not-allowed rounded border text-neutral-400": !pageInfo?.hasNextPage,
				})}
				aria-disabled={!pageInfo?.hasNextPage}
			>
				Next page
			</Link>
		</nav>
	);
}
