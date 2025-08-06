"use client"

import { useState } from "react"
import { Bell, X, Info, AlertTriangle, CreditCard, TrendingUp, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

const notifications = [
	{
		id: 1,
		title: "New Feature",
		message: "Check out our new budget tracking tool!",
		date: "2023-07-15",
		icon: Info,
		color: "text-blue-500",
	},
	{
		id: 2,
		title: "Account Alert",
		message: "Unusual activity detected on your account.",
		date: "2023-07-14",
		icon: AlertTriangle,
		color: "text-yellow-500",
	},
	{
		id: 3,
		title: "Payment Due",
		message: "Your credit card payment is due in 3 days.",
		date: "2023-07-13",
		icon: CreditCard,
		color: "text-red-500",
	},
	{
		id: 4,
		title: "Investment Update",
		message: "Your investment portfolio has grown by 5% this month.",
		date: "2023-07-12",
		icon: TrendingUp,
		color: "text-green-500",
	},
	{
		id: 5,
		title: "New Offer",
		message: "You're eligible for a new savings account with higher interest!",
		date: "2023-07-11",
		icon: Gift,
		color: "text-purple-500",
	},
]

export function Notifications() {
	const [isOpen, setIsOpen] = useState(false)

	const handleClose = () => {
		setIsOpen(false)
	}

	return (
		<div className="relative">
			<Button
				variant="ghost"
				size="icon"
				className="relative"
				onClick={() => setIsOpen(!isOpen)}
				aria-label="Notifications"
			>
				<Bell className="h-5 w-5" />
				<span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
			</Button>
			{isOpen && (
				<>
					<div
						className="fixed inset-0 z-40 md:hidden bg-black/20 backdrop-blur-sm"
						onClick={handleClose}
						aria-hidden="true"
					/>
					<Card className="absolute right-0 mt-2 w-[calc(100vw-32px)] sm:w-80 md:w-96 max-w-[90vw] z-50">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Notifications</CardTitle>
							<Button
								variant="ghost"
								size="icon"
								onClick={handleClose}
								aria-label="Close notifications"
							>
								<X className="h-4 w-4" />
							</Button>
						</CardHeader>
						<CardContent className="p-3 sm:p-4">
							<ScrollArea className="h-[300px] sm:h-[400px] pr-2 sm:pr-4">
								{notifications.map((notification) => (
									<Card key={notification.id} className="mb-4 last:mb-0 border shadow-sm">
										<CardContent className="p-3 sm:p-4">
											<div className="flex items-start space-x-3 space-y-0">
												<div
													className={`${notification.color} p-1.5 rounded-full bg-opacity-10`}
												>
													<notification.icon
														className={`h-4 w-4 ${notification.color}`}
													/>
												</div>
												<div className="flex-1 space-y-1">
													<p className="text-sm font-medium leading-none">
														{notification.title}
													</p>
													<p className="text-xs sm:text-sm text-muted-foreground">
														{notification.message}
													</p>
													<p className="text-xs text-muted-foreground">
														{notification.date}
													</p>
												</div>
											</div>
										</CardContent>
									</Card>
								))}
							</ScrollArea>
						</CardContent>
					</Card>
				</>
			)}
		</div>
	)
}
