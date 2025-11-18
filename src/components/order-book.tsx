import { useEffect, useState, type FC } from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

interface OrderBookData {
  lastUpdateId: number
  bids: string[][]
  asks: string[][]
}

const DEPTH = 10;

export const OrderBook: FC = () => {
	const [data, setData] = useState<OrderBookData>({
    asks: [],
    bids: [],
    lastUpdateId: 0
  });

	useEffect(() => {
		const ws = new WebSocket(
			`wss://stream.binance.com:9443/ws/btcusdt@depth${DEPTH}`,
		);

		ws.onmessage = (evt) => {
			const message: OrderBookData = JSON.parse(evt.data);
			message.asks = message.asks.reverse();
			setData(message);
		};

		() => {
			return ws.close();
		};
	}, []);

	return (
    <Table>
			<TableCaption>Order Book</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead>Price</TableHead>
					<TableHead className="text-right">Amount</TableHead>
					<TableHead className="text-right">Total</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{data.asks.map((order, index) => (
					<TableRow key={index}>
						<TableCell className="text-red-700">{Number(order[0]).toFixed(2)}</TableCell>
						<TableCell className="text-right">
              {Number(order[1]).toFixed(5)}
						</TableCell>
            <TableCell className="text-right">
              {(Number(order[0]) * Number(order[1])).toFixed(5)}
						</TableCell>
					</TableRow>
				))}
        {data.bids.map((order, index) => (
					<TableRow key={index}>
						<TableCell className="text-green-700">{Number(order[0]).toFixed(2)}</TableCell>
						<TableCell className="text-right">
              {Number(order[1]).toFixed(5)}
						</TableCell>
            <TableCell className="text-right">
              {(Number(order[0]) * Number(order[1])).toFixed(5)}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};
