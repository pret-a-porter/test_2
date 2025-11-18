import { useEffect, useState, type FC } from "react";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "./ui/table";

interface Trade {
	e: "trade"; // Event type
	E: number; // Event time
	s: string; // Symbol
	t: number; // Trade ID
	p: string; // Price
	q: string; // Quantity
	T: number; // Trade time
	m: boolean; // Is the buyer the market maker?
	M: boolean; // Ignore
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
	hour: "2-digit",
	hour12: false,
	minute: "2-digit",
	second: "2-digit",
});

const MAX_DISPLAYED_TRADES = 16;

export const Trades: FC = () => {
	const [data, setData] = useState<Trade[]>([]);

	useEffect(() => {
		const ws = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@trade");

		ws.onmessage = (evt) => {
			const message: Trade = JSON.parse(evt.data);
			setData((prevData) => {
        if (prevData.some(trade => trade.t === message.t)) {
          return prevData.map(trade => trade.t === message.t ? message : trade);
        }
        const newData = [message, ...prevData];
        return newData.slice(0, MAX_DISPLAYED_TRADES);
      });
		};

		() => {
			return ws.close();
		};
	}, []);

	return (
		<Table>
			<TableCaption>Market Trades</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead>Price</TableHead>
					<TableHead className="text-right">Amount</TableHead>
					<TableHead className="text-right">Time</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{data.map((trade) => (
					<TableRow key={trade.t}>
						<TableCell>{trade.p}</TableCell>
						<TableCell className="text-right">{trade.q}</TableCell>
						<TableCell className="text-right">
							{dateFormatter.format(new Date(trade.T))}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};
