import { useState, useEffect, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  Bell,
  UserPlus,
  AtSign,
  Zap,
} from "lucide-react"

// Sample notification messages for real-time simulation
const sampleNotifications = [
  { type: "join_request", user: "Alex Chen", project: "Neural Search API" },
  { type: "mention", user: "Maya Rodriguez", project: "BuildSpace Frontend", message: "mentioned you in a comment" },
  { type: "system", message: "Your project deployment completed successfully" },
  { type: "join_request", user: "Jordan Kim", project: "AI Code Review" },
  { type: "mention", user: "Sam Taylor", project: "Design System", message: "tagged you in a task" },
  { type: "system", message: "Weekly analytics report is ready" },
  { type: "join_request", user: "Casey Morgan", project: "ChemSAGE Frontend" },
  { type: "mention", user: "Riley Davis", project: "API Gateway", message: "replied to your thread" },
]

// Initial notifications
const initialNotifications = [
  {
    id: "1",
    type: "join_request",
    content: { user: "Sarah", project: "ChemSAGE Frontend" },
    time: "2m ago",
    isRead: false,
  },
  {
    id: "2",
    type: "mention",
    content: { user: "Marcus", project: "BuildSpace Core", message: "mentioned you in a review" },
    time: "5m ago",
    isRead: false,
  },
  {
    id: "3",
    type: "system",
    content: { message: "Your API key was regenerated successfully" },
    time: "12m ago",
    isRead: false,
  },
  {
    id: "4",
    type: "join_request",
    content: { user: "Emma", project: "Neural Interface" },
    time: "1h ago",
    isRead: true,
  },
  {
    id: "5",
    type: "mention",
    content: { user: "David", project: "Analytics Dashboard", message: "assigned you a task" },
    time: "2h ago",
    isRead: true,
  },
  {
    id: "6",
    type: "system",
    content: { message: "New team member joined your workspace" },
    time: "3h ago",
    isRead: true,
  },
]

// Icon mapping for notification types
const notificationIcons = {
  join_request: UserPlus,
  mention: AtSign,
  system: Zap,
}

// Notification Item Component
function NotificationItem({
  notification,
  onMarkAsRead,
  onAccept,
  onDecline,
}) {
  const [isHovered, setIsHovered] = useState(false)
  const Icon = notificationIcons[notification.type]

  const renderContent = () => {
    switch (notification.type) {
      case "join_request":
        return (
          <>
            <span className="font-medium text-white">{notification.content.user}</span>
            <span className={notification.isRead ? "text-[#666]" : "text-[#888]"}> requested to join </span>
            <span className="font-medium text-white">{notification.content.project}</span>
          </>
        )
      case "mention":
        return (
          <>
            <span className="font-medium text-white">{notification.content.user}</span>
            <span className={notification.isRead ? "text-[#666]" : "text-[#888]"}>
              {" "}
              {notification.content.message} in{" "}
            </span>
            <span className="font-medium text-white">{notification.content.project}</span>
          </>
        )
      case "system":
        return (
          <span className={notification.isRead ? "text-[#666]" : "text-[#888]"}>
            {notification.content.message}
          </span>
        )
      default:
        return null
    }
  }

  const renderActions = () => {
    if (notification.type === "join_request" && !notification.isRead) {
      return (
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={() => onDecline?.(notification.id)}
            className="border border-[#1f1f1f] bg-[#0a0a0a] cursor-pointer px-3 py-1 text-xs text-[#888] transition-colors hover:border-[#444] hover:text-white"
          >
            Decline
          </button>
          <button
            onClick={() => onAccept?.(notification.id)}
            className="bg-[#e8ff47] px-3 py-1 text-xs cursor-pointer font-bold text-black transition-shadow hover:shadow-[0_0_10px_rgba(232,255,71,0.3)]"
          >
            Accept
          </button>
        </div>
      )
    }

    if ((notification.type === "mention" || notification.type === "system") && isHovered && !notification.isRead) {
      return (
        <motion.button
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          onClick={() => onMarkAsRead(notification.id)}
          className="shrink-0 border cursor-pointer border-[#1f1f1f] bg-[#0a0a0a] px-3 py-1 text-xs text-[#e8ff47] transition-colors hover:bg-[#e8ff47]/10"
        >
          View
        </motion.button>
      )
    }

    return null
  }

  return (
    <motion.div
      layout
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 20,
        opacity: { duration: 0.2 },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`overflow-hidden border-b border-[#1f1f1f] transition-colors hover:bg-[#111] ${
        !notification.isRead ? "border-l-2 border-l-[#e8ff47]" : ""
      }`}
    >
      <div className="flex items-center gap-4 p-4">
        {/* Icon */}
        <div className={`shrink-0 ${notification.isRead ? "text-[#444]" : "text-white"}`}>
          <Icon className="h-5 w-5" />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <p className="text-sm leading-relaxed">{renderContent()}</p>
          <p className={`mt-1 text-xs font-mono ${notification.isRead ? "text-[#444]" : "text-[#777]"}`}>
            {notification.time}
          </p>
        </div>

        {/* Actions */}
        <AnimatePresence>{renderActions()}</AnimatePresence>
      </div>
    </motion.div>
  )
}

export default function Notifications() {
  const [notifications, setNotifications] = useState(initialNotifications)

  const unreadCount = notifications.filter((n) => !n.isRead).length

  // Real-time notification simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const randomSample = sampleNotifications[Math.floor(Math.random() * sampleNotifications.length)]
      const newNotification = {
        id: `new-${Date.now()}`,
        type: randomSample.type,
        content:
          randomSample.type === "system"
            ? { message: randomSample.message }
            : { user: randomSample.user, project: randomSample.project, message: randomSample.message },
        time: "Just now",
        isRead: false,
      }

      setNotifications((prev) => [newNotification, ...prev])
    }, 15000)

    return () => clearInterval(interval)
  }, [])

  const markAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    )
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }, [])

  const handleAccept = useCallback((id) => {
    markAsRead(id)
  }, [markAsRead])

  const handleDecline = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  return (
    <div className="relative min-h-[calc(100vh-64px)] font-sans bg-[#040404]">
      {/* Main Content Area */}
      <main className="mx-auto max-w-3xl px-6 pt-12 pb-24">
        {/* Header & Controls */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-white">Inbox</h1>
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-[#e8ff47]/10 px-2 flex items-center py-0.5 text-sm font-mono text-[#e8ff47]"
              >
                {unreadCount} Unread
              </motion.span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="group relative cursor-pointer text-sm font-mono text-[#888] transition-colors hover:text-white"
            >
              Mark all as read
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#e8ff47] transition-all group-hover:w-full" />
            </button>
          )}
        </div>

        {/* Notifications List */}
        <motion.div layout className="border-t border-[#1f1f1f]">
          <AnimatePresence initial={false}>
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={markAsRead}
                onAccept={handleAccept}
                onDecline={handleDecline}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {notifications.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <Bell className="mb-4 h-12 w-12 text-[#222]" />
            <p className="text-sm font-mono text-[#666]">{"You're all caught up!"}</p>
          </motion.div>
        )}
      </main>
    </div>
  )
}
