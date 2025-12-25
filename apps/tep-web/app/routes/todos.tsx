import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod/v4";
import { debounce } from "lodash";
import { Check, Dot, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { data, useFetcher, useSearchParams } from "react-router";
import { v7 as uuidv7 } from "uuid";
import z from "zod";
import type { Route } from "../../.react-router/types/app/routes/+types/todos";

const schema = z.union([
	z.object({
		intent: z.literal("update-name"),
		id: z.uuidv7(),
		name: z.string().max(30, {
			error: "The todo item name can only be 30 characters long!",
		}),
	}),
	z.object({
		intent: z.literal("toggle-completion-state"),
		id: z.uuidv7(),
	}),
	z.object({
		intent: z.literal("delete"),
		id: z.uuidv7(),
	}),
]);

type TodoItem = {
	id: string;
	name: string;
	isCompleted: boolean;
};

let todos: TodoItem[] = [
	{
		id: uuidv7(),
		name: "Eierpunsch",
		isCompleted: false,
	},
	{
		id: uuidv7(),
		name: "Spekulatius",
		isCompleted: false,
	},
	{
		id: uuidv7(),
		name: "Glühwein",
		isCompleted: true,
	},
	{
		id: uuidv7(),
		name: "Baumkuchen",
		isCompleted: false,
	},
];

export const action = async ({ request }: Route.ActionArgs) => {
	const formData = await request.formData();

	const submission = parseWithZod(formData, { schema });

	if (submission.status !== "success") {
		return submission.reply();
	}

	const payload = submission.value;

	switch (payload.intent) {
		case "update-name": {
			console.log("Updating name...");
			todos = todos.map((todo) =>
				todo.id === payload.id
					? {
							...todo,
							name: payload.name,
						}
					: todo,
			);
			break;
		}
		case "toggle-completion-state": {
			console.log("Toggling completion state...");
			todos = todos.map((todo) =>
				todo.id === payload.id
					? {
							...todo,
							isCompleted: !todo.isCompleted,
						}
					: todo,
			);
			break;
		}
		case "delete": {
			console.log("Deleting todo item...");
			todos = todos.filter((todo) => todo.id !== payload.id);
			break;
		}
		default: {
			throw data("Invalid Intent", { status: 400 });
		}
	}

	return data(submission.reply());
};

export const loader = ({ request }: Route.LoaderArgs) => {
	const searchParams = new URL(request.url).searchParams;

	const search = searchParams.get("search");

	if (!search || search === "") {
		return { todos };
	}

	return {
		todos: todos.filter(({ name }) =>
			name.toLowerCase().includes(search.toLowerCase()),
		),
	};
};

const TodoListItem = ({ todo }: { todo: TodoItem }) => {
	const submitNameUpdateBtnRef = useRef<HTMLButtonElement>(null);

	const { Form, data: lastResult, state } = useFetcher<typeof action>();

	const [form, fields] = useForm({
		lastResult,
		onValidate: ({ formData }) => parseWithZod(formData, { schema }),
		defaultValue: {
			id: todo.id,
			name: todo.name,
		},
		shouldValidate: "onBlur",
		shouldRevalidate: "onInput",
	});

	const [updateSuccessful, setUpdateSuccessful] = useState<boolean>(false);

	const loading = useMemo(() => state === "submitting", [state]);

	const onNameInputChange = useCallback(
		debounce(() => {
			submitNameUpdateBtnRef.current?.click();
		}, 500),
		[],
	);

	useEffect(() => {
		console.log(lastResult);
		if (lastResult?.status === "success") {
			setUpdateSuccessful(true);
		}
	}, [lastResult]);

	const resetUpdateSuccesful = useCallback(
		debounce(() => setUpdateSuccessful(false), 1500),
		[],
	);

	useEffect(() => {
		if (updateSuccessful) resetUpdateSuccesful();
	}, [updateSuccessful, resetUpdateSuccesful]);

	return (
		<>
			<Form
				{...getFormProps(form)}
				method="POST"
				action="/todos"
				onSubmit={form.onSubmit}
				className="grid grid-cols-[auto_1fr_auto] items-center gap-4"
			>
				<input
					{...getInputProps(fields.id, { type: "hidden" })}
					defaultValue={fields.id.initialValue}
				/>
				<button
					type="submit"
					name="intent"
					value="toggle-completion-state"
					className="cursor-pointer rounded-md border border-gray-400 bg-gray-600 p-1"
				>
					<Check
						className={[
							"size-4",
							todo.isCompleted ? "text-white" : "text-transparent",
						].join(" ")}
					/>
				</button>
				<span className="relative w-full">
					<input
						{...getInputProps(fields.name, { type: "text" })}
						defaultValue={fields.name.initialValue}
						onInput={() => onNameInputChange()}
						className="w-full rounded-sm border border-gray-400 bg-transparent px-3 py-1.5"
					/>
					{loading ? (
						<Dot className="-translate-y-1/2 absolute top-1/2 right-2 z-20 animate-ping text-orange-500" />
					) : (
						<Check
							className={[
								"-translate-y-1/2 absolute top-1/2 right-2 z-20",
								updateSuccessful ? "text-green-500" : "text-transparent",
							].join(" ")}
						/>
					)}
				</span>
				<button
					ref={submitNameUpdateBtnRef}
					name="intent"
					value="update-name"
					type="submit"
					className="hidden"
				/>
				<button
					type="submit"
					formMethod="DELETE"
					name="intent"
					value="delete"
					className="cursor-pointer rounded-full bg-gray-600 p-2"
				>
					<Trash2 className="size-4 text-red-500" />
				</button>
			</Form>

			{form.errors ? (
				<p className="w-full px-2 py-1 text-center text-red-400 text-sm">
					{form.errors.join(", ")}
				</p>
			) : undefined}
		</>
	);
};

export default function ({ loaderData: { todos } }: Route.ComponentProps) {
	// Get search params via hook and initialize search state
	const [searchParams, setSearchParams] = useSearchParams();
	const initialSearch = searchParams.get("search");
	const [search, setSearch] = useState<string>(initialSearch ?? "");

	// Debounced search handler
	useEffect(() => {
		const timeout = setTimeout(() => {
			if (
				search !== initialSearch &&
				!(initialSearch === null && search === "")
			) {
				console.log("Searching");
				setSearchParams((params) => {
					if (!search) {
						params.delete("search");
						return params;
					}
					params.set("search", search);
					return params;
				});
			}
		}, 300);

		return () => clearTimeout(timeout);
	}, [search, setSearchParams, initialSearch]);

	return (
		<main className="flex h-full w-full flex-row justify-center overflow-hidden px-2">
			<div className="grid w-full max-w-lg grid-cols-1 grid-rows-[auto_1fr] gap-2 py-4">
				<input
					type="search"
					placeholder="Search..."
					value={search}
					onInput={({ currentTarget }) => setSearch(currentTarget.value)}
					className="rounded-sm border border-gray-500 bg-gray-900 p-1 hover:border-gray-400"
				/>

				<div className="grid h-full w-full grid-cols-1 gap-y-2 overflow-y-auto rounded-md bg-gray-900 p-2">
					{todos.map((todo) => (
						<TodoListItem key={todo.id} todo={todo} />
					))}
				</div>
			</div>
		</main>
	);
}
