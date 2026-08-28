"use client";

import React from "react";
import {
  Badge,
  Button,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@heroui/react";
import {
  Bell,
  Check,
  ChevronRight,
  Megaphone,
} from "lucide-react";

interface Notification {
  id: number;
  title: string;
  description: string;
  time: string;
  type: "info" | "success" | "warning";
  unread: boolean;
}

const notifications: Notification[] = [
  {
    id: 1,
    title: "Kelas AI Mastery dimulai",
    description: "Live mentoring akan dimulai dalam 30 menit.",
    time: "10 menit lalu",
    type: "info",
    unread: true,
  },
  {
    id: 2,
    title: "Sertifikat berhasil diterbitkan",
    description: "Sertifikat kelas Digital Marketing tersedia.",
    time: "1 jam lalu",
    type: "success",
    unread: true,
  },
  {
    id: 3,
    title: "Promo khusus untuk UMKM",
    description: "Dapatkan diskon hingga 50% untuk kelas pilihan.",
    time: "3 jam lalu",
    type: "warning",
    unread: false,
  },
];

const notificationIcons = {
  info: Bell,
  success: Check,
  warning: Megaphone,
};

export function NotificationDropdown() {
  const unreadCount = notifications.filter(
    (notification) => notification.unread,
  ).length;

  return (
    <Dropdown
      placement="bottom-end"
      offset={12}
      classNames={{
        content:
          "min-w-[380px] rounded-2xl border border-[#F3E2DC] bg-[#FFF9F6] p-1.5 shadow-[0_12px_40px_rgba(45,33,32,0.12)]",
      }}
    >
      <DropdownTrigger>
        <Button
          isIconOnly
          variant="light"
          radius="full"
          className="h-11 w-11 min-w-11 text-[#2D2120] hover:bg-[#FFF0EB]"
          aria-label="Notifications"
        >
          <Badge
            content={unreadCount}
            color="danger"
            size="sm"
            placement="top-right"
            isInvisible={unreadCount === 0}
            classNames={{
              badge:
                "border-2 border-[#FFF9F6] bg-[#FF5E3A] text-[10px] font-bold",
            }}
          >
            <Bell size={21} strokeWidth={2} />
          </Badge>
        </Button>
      </DropdownTrigger>

      <DropdownMenu
        aria-label="Notifications"
        className="w-full p-0"
        itemClasses={{
          base: "rounded-xl",
        }}
      >
        {/* Header */}
        <DropdownItem
          key="notification-header"
          isReadOnly
          className="cursor-default px-3 py-2"
          textValue="Notification header"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#2D2120]">
                Notifikasi
              </h3>

              <p className="mt-0.5 text-xs text-[#7A6664]">
                {unreadCount} notifikasi belum dibaca
              </p>
            </div>

            <Button
              size="sm"
              variant="light"
              className="h-8 px-2 text-xs font-semibold text-[#FF5E3A]"
            >
              Tandai dibaca
            </Button>
          </div>
        </DropdownItem>

        <DropdownItem
          key="notification-divider"
          isReadOnly
          className="cursor-default px-3 py-0"
          textValue="Divider"
        >
          <Divider className="bg-[#F3E2DC]" />
        </DropdownItem>

        {/* Dynamic Notifications */}
        <DropdownSection
          aria-label="Notification list"
          items={notifications}
          className="p-0"
        >
          {(notification) => {
            const Icon = notificationIcons[notification.type];

            return (
              <DropdownItem
                key={notification.id}
                textValue={notification.title}
                className="px-1 py-1"
              >
                <div
                  className={`flex gap-3 rounded-xl p-3 ${
                    notification.unread
                      ? "bg-[#FFF0EB]"
                      : "hover:bg-[#FFF5F1]"
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      notification.type === "success"
                        ? "bg-[#E8F8EF] text-[#20A464]"
                        : notification.type === "warning"
                          ? "bg-[#FFF4DD] text-[#FF9F43]"
                          : "bg-[#FFE8E1] text-[#FF5E3A]"
                    }`}
                  >
                    <Icon size={18} />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start gap-2">
                      <p className="text-sm font-semibold text-[#2D2120]">
                        {notification.title}
                      </p>

                      {notification.unread && (
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF5E3A]" />
                      )}
                    </div>

                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#7A6664]">
                      {notification.description}
                    </p>

                    <p className="mt-1.5 text-[11px] text-[#A18C88]">
                      {notification.time}
                    </p>
                  </div>
                </div>
              </DropdownItem>
            );
          }}
        </DropdownSection>

        {/* Footer */}
        <DropdownItem
          key="notification-footer"
          isReadOnly
          className="cursor-default px-2 py-1"
          textValue="View all notifications"
        >
          <Divider className="mb-2 bg-[#F3E2DC]" />

          <Button
            variant="light"
            fullWidth
            className="h-10 justify-between px-3 text-sm font-semibold text-[#FF5E3A]"
            endContent={<ChevronRight size={16} />}
          >
            Lihat semua notifikasi
          </Button>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}