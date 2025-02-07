import { DraftOrderCreateDocument } from "@/gql/graphql";
import type { DraftOrderCreateMutationVariables } from "@/gql/graphql";
import { CART_COOKIE } from "@/lib/cart";
import { executeAdminGraphQL } from "@/lib/graphql";
import { type NextRequest, NextResponse } from "next/server";

// Оголошуємо тип для input
interface DraftOrderCreateRequestBody {
	input: DraftOrderCreateMutationVariables["input"];
}

const channelsId = [
	{
		id: "Q2hhbm5lbDo0",
		slug: "channel-eur",
	},
	{
		id: "Q2hhbm5lbDoy",
		slug: "channel-pln",
	},
	{
		id: "Q2hhbm5lbDox",
		slug: "default-channel",
	},
];

export async function POST(request: NextRequest) {
	try {
		// Парсимо JSON як unknown
		const requestData: unknown = await request.json();

		// Перевіряємо, чи є в запиті input
		if (isValidDraftOrderCreateRequestBody(requestData)) {
			const { input } = requestData;

			if (!input) {
				return NextResponse.json({ message: "Input is required" }, { status: 500 });
			}
			const findChannelId = channelsId.find((element) => element.slug === input.channelId)?.id;
			if (!findChannelId) {
				return NextResponse.json({ message: "Channel is invalid" }, { status: 500 });
			}
			console.log(input, "input");

			const createOrderInSaleor = await executeAdminGraphQL(DraftOrderCreateDocument, {
				variables: {
					input: {
						...input,
						channelId: findChannelId,
					},
				},
			});

			const response = NextResponse.json({
				createdOrder: createOrderInSaleor,
				message: "Order Create Successful",
			});

			response.cookies.set(CART_COOKIE, "", {
				expires: new Date(0), // Set the expiration date to the past to delete the cookie
			});

			return response;
		} else {
			return NextResponse.json({ message: "Invalid request data" }, { status: 400 });
		}
	} catch (error) {
		console.log(error);
		return NextResponse.json({ error: `internal server error: ${error}` }, { status: 500 });
	}
}

// Типова перевірка для DraftOrderCreateRequestBody
function isValidDraftOrderCreateRequestBody(data: unknown): data is DraftOrderCreateRequestBody {
	return (
		typeof data === "object" &&
		data !== null &&
		"input" in data &&
		typeof (data as { input: unknown }).input === "object" &&
		(data as { input: unknown }).input !== null
	);
}
