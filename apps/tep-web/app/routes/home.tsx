import { Link } from "react-router";

export function meta() {
	return [
		{ title: "New React Router App" },
		{ name: "description", content: "Welcome to React Router!" },
	];
}

export default function Home() {
	return (
		<div className="flex h-screen w-screen flex-col items-center justify-center bg-gray-900">
			<Link
				to="/todos"
				className="rounded-sm border-violet-300 bg-gray-800 px-8 py-3 text-white"
			>
				Open ToDo-List
			</Link>
		</div>
	);
}
