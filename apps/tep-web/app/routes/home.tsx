export function meta() {
	return [
		{ title: "TEP - Home" },
		{ name: "description", content: "The Homepage of TEP" },
	];
}

export default function Home() {
	return (
		<div className="flex h-screen w-screen flex-col items-center justify-center bg-gray-900">
			Hello World
		</div>
	);
}
