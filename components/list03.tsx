'use client'

import { Calendar, Users, ArrowRight, Clock, Target } from "lucide-react"
import { Dictionary } from "@/locales/dictionary"
import { formatCurrency, formatDate } from "@/lib/i18n/utils"

const events = [
  {
    id: 1,
    title: "Board Meeting",
    subtitle: "Quarterly review",
    date: "2023-06-28",
    icon: Users,
    progress: 75,
    target: 100,
    status: "Upcoming",
  },
  {
    id: 2,
    title: "Product Launch",
    subtitle: "Version 2.0 release",
    date: "2023-07-15",
    icon: Target,
    progress: 40,
    target: 500,
    status: "In Progress",
  },
  {
    id: 3,
    title: "Team Workshop",
    subtitle: "Skills development",
    date: "2023-07-05",
    icon: Users,
    progress: 90,
    target: 50,
    status: "Completed",
  },
]

const statusColors = {
  Upcoming: "bg-yellow-100 text-yellow-800",
  "In Progress": "bg-blue-100 text-blue-800",
  Completed: "bg-green-100 text-green-800",
}

interface List03Props {
  dictionary: Dictionary;
  locale: string;
}

export function List03({ dictionary, locale }: List03Props) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          {dictionary.calendar.title || "Upcoming Events"}
        </h2>
      </div>
      <div className="space-x-4 overflow-x-auto flex pb-4">
        {events.map((event) => (
          <div key={event.id} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 w-72 flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-gray-200 dark:bg-gray-600 rounded-full">
                <event.icon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[event.status as keyof typeof statusColors]}`}>
                {event.status}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">{event.title}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{event.subtitle}</p>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 mb-3">
              <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${event.progress}%` }}></div>
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {formatCurrency(event.target, locale, 'MAD')}
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                  {dictionary.calendar.target || "target"}
                </span>
              </span>
              <span className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <Calendar className="h-3 w-3 mr-1" />
                {formatDate(new Date(event.date), locale, { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </span>
            </div>
            <button className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors flex items-center justify-center">
              {dictionary.actions.view || "View Details"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
