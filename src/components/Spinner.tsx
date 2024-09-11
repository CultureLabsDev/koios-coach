type Props = {
	message: string;
	color?: string;
};

export default ({ message, color = 'secondary' }: Props) => (
	<div class="w-full h-full fadeIn">
		<div class="flex items-center justify-center">
			<div>
				<div id="spinner-message" class={`text-xl font-bold text-${color} mb-4 mt-10`}>
					{message}
				</div>
				<div
					class={`w-44 h-44 border-l-8 border-${color} rounded-full animate-spin relative`}
				></div>
			</div>
		</div>
	</div>
);
