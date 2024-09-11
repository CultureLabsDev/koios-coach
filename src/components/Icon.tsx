interface Props {
	id: string;
	size?: number;
}
export default ({ id, size = 24 }: Props) => (
	<svg
		width={size}
		height={size}
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<use href={`/static/img/icons/feather-sprite.svg#${id}`} />
	</svg>
);
