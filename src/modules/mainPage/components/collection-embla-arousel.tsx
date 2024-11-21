"use client";
import { deslugify } from "@/lib/utils";
import {
	NextButton,
	PrevButton,
	SelectedSnapDisplay,
	usePrevNextButtons,
	useSelectedSnapDisplay,
} from "@/ui/embla-carousel-arrow-buttons";
import { YnsLink } from "@/ui/yns-link";
import type { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import type React from "react";
import "../styles/style.css";
import type { CollectionCountableEdge } from "@/gql/graphql";


type PropType = {
	slides: CollectionCountableEdge[];
	options: EmblaOptionsType;
};

const CategoryEmblaCarousel: React.FC<PropType> = ({ slides, options }) => {
	const [emblaRef, emblaApi] = useEmblaCarousel(options);
	const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } =
		usePrevNextButtons(emblaApi);
	const { selectedSnap, snapCount } = useSelectedSnapDisplay(emblaApi);

	return (
		<section className="main_embla">
			{/* Слайдер до 768px і сітка після 768px */}
			<div className="main_embla__viewport md:hidden" ref={emblaRef}>
				<div className="main_embla__container">
					{slides.map(({ node }) => (
						<div className="main_embla__slide" key={node.id}>
							<YnsLink
								href={`/collection/${node?.slug}`}
								className="main_embla__link bg-white shadow-lg rounded-lg font-sans text-black group relative max-w-[90vw] overflow-hidden"
							>
								{node?.backgroundImage && (
									<Image
										alt={node?.backgroundImage?.alt || "Cover image"}
										className="w-full h-auto scale-105 object-cover transition-all group-hover:scale-100 group-hover:opacity-75"
										sizes="(max-width: 1024x) 100vw, (max-width: 1280px) 50vw, 620px"
										src={node?.backgroundImage?.url || ""}
										width={100}
										height={100}
									/>
								)}
								<div className="justify-end gap-2 px-4 py-2 text-neutral-600">
									<h3 className="text-lg font-bold tracking-tight">{deslugify(node.slug)}</h3>
									<p>shopNow</p>
								</div>
							</YnsLink>
						</div>
					))}
				</div>
			</div>

			{/* Сітка після 768px */}
			<div className="hidden md:grid md:grid-cols-3 md:gap-10">
				{slides.map(({ node }) => (
					<YnsLink
						href={`/collection/${node?.slug}`}
						className="bg-white shadow-lg rounded-lg font-sans text-black group relative overflow-hidden"
						key={node.id}
					>
						{node?.backgroundImage && (
							<Image
								alt={node?.backgroundImage?.alt || "Cover image"}
								className="w-full h-auto scale-105 object-cover transition-all group-hover:scale-100 group-hover:opacity-75"
								sizes="(max-width: 1024x) 100vw, (max-width: 1280px) 50vw, 620px"
								src={node?.backgroundImage?.url || ""}
								width={100}
								height={100}
							/>
						)}
						<div className="justify-end gap-2 px-4 py-2 text-neutral-600">
							<h3 className="text-lg font-bold tracking-tight">{deslugify(node.slug)}</h3>
							<p>shopNow</p>
						</div>
					</YnsLink>
				))}
			</div>

			{/* Контролери для слайдера */}
			<div className="main_embla__controls md:hidden md:opacity-0 md:h-0">
				<div className="main_embla__buttons">
					<PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
					<NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
				</div>
				<SelectedSnapDisplay selectedSnap={selectedSnap} snapCount={snapCount} />
			</div>
		</section>
	);
};

export default CategoryEmblaCarousel;
