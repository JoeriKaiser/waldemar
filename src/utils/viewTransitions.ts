import type { TransitionAnimationPair } from "astro";

const forwards: TransitionAnimationPair = {
	old: {
		name: "fadeOutUp",
		duration: "0.2s",
		easing: "ease-in",
		fillMode: "forwards",
	},
	new: {
		name: "fadeInUp",
		duration: "0.3s",
		delay: "0.2s",
		easing: "ease-out",
		fillMode: "backwards",
	},
};

const backwards: TransitionAnimationPair = {
	old: {
		name: "fadeOutDown",
		duration: "0.2s",
		easing: "ease-in",
		fillMode: "forwards",
	},
	new: {
		name: "fadeInDown",
		duration: "0.3s",
		delay: "0.2s",
		easing: "ease-out",
		fillMode: "backwards",
	},
};

const viewTransition = {
	forwards,
	backwards,
};

export default viewTransition;
