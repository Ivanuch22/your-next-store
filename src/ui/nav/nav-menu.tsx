import { GetNavigationDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import RadixAccordion from "@/ui/nav/RadixAccordion";
import RadixAccordionMobile from "@/ui/nav/RadixAccordionMobile";
import { NavMobileMenu } from "@/ui/nav/nav-mobile-menu.client";
import { cookies } from "next/headers";

export const NavMenu = async () => {
	const cookie = await cookies();
	const channel = cookie.get("channel")?.value || "default-channel";

	const navLinks = await executeGraphQL(GetNavigationDocument, {
		variables: { slug: "navbar", channel },
		revalidate: 60 * 5,
	});
	return (
		<>
			<div className="sm:block hidden">
				<ul className="flex flex-row items-center justify-center gap-x-1">
					<RadixAccordion items={navLinks?.menu?.items} />
				</ul>
			</div>
			<div className="sm:hidden  flex items-center min-h-full ">
				<NavMobileMenu className="">
					<ul className="h-full flex pb-8 font-normal flex-col items-stretch justify-start gap-x-1  pt-3">
						<RadixAccordionMobile items={navLinks?.menu?.items} />
					</ul>
				</NavMobileMenu>
			</div>
		</>
	);
};
