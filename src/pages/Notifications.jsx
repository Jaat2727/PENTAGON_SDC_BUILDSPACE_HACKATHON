import NotificationList from "../components/notifications/NotificationList"

export default function Notifications() {
  return (
    <div className="relative min-h-[calc(100vh-64px)] font-sans bg-[#040404]">
      <div className="max-w-4xl mx-auto pt-12 px-6 pb-24">
        <NotificationList />
      </div>
    </div>
  )
}
