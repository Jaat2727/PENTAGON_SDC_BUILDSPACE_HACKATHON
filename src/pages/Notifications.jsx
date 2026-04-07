/*
  Notifications.jsx
  -----------------
  Full notification inbox page. Just wraps the NotificationList
  component inside a page wrapper.
*/

import PageWrapper from "../components/layout/PageWrapper";
import NotificationList from "../components/notifications/NotificationList";

export default function Notifications() {
  return (
    <PageWrapper className="max-w-2xl">
      <NotificationList />
    </PageWrapper>
  );
}
