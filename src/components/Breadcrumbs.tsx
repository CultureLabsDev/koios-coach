type Props = {
	crumbs: { href?: string; title: string }[];
};
export default ({ crumbs }: Props) => {
	return (
		<div class="text-xl breadcrumbs" id="breadcrumbs">
			<ul>
				{crumbs.map((crumb) =>
					!crumb.href ? (
						<li class="lowercase">{crumb.title}</li>
					) : (
						<li>
							<a href={crumb.href} class="text-primary lowercase">
								{crumb.title}
							</a>
						</li>
					)
				)}
			</ul>
		</div>
	);
};
