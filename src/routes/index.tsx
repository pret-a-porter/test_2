import { OrderBook } from "@/components/order-book";
import { Trades } from "@/components/trades";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: App,
});

function App() {
	return (
		<main className="grid grid-cols-2 gap-10">
			<OrderBook />
			<Trades />
		</main>
	);
}
