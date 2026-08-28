"use client";

import React from "react";
import {
  Avatar,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@heroui/react";
import {
  BookOpen,
  ChevronRight,
  CircleHelp,
  LogOut,
  Settings,
  UserRound,
  Wallet,
} from "lucide-react";

interface ProfileDropdownProps {
  name?: string;
  email?: string;
  role?: string;
  avatarUrl?: string;
  balance?: string;
  onLogout?: () => void;
}

export function ProfileDropdown({
  name = "Muhammad Rafli",
  email = "rafli@example.com",
  role = "Educator",
  avatarUrl,
  balance = "Rp 150.000",
  onLogout,
}: ProfileDropdownProps) {
  return (
    <Dropdown
      placement="bottom-end"
      offset={12}
      classNames={{
        content:
          "min-w-[300px] rounded-2xl border border-[#F3E2DC] bg-[#FFF9F6] p-1.5 shadow-[0_12px_40px_rgba(45,33,32,0.12)]",
      }}
    >
      <DropdownTrigger>
        <button
          type="button"
          className="rounded-full outline-none ring-offset-2 transition-all hover:ring-2 hover:ring-[#FF5E3A]/20 focus:ring-2 focus:ring-[#FF5E3A]/30"
          aria-label="Open profile menu"
        >
          <Avatar
            src={avatarUrl}
            name={name}
            size="md"
            classNames={{
              base: "bg-[#FFE8E1]",
              name: "font-semibold text-[#FF5E3A]",
            }}
          />
        </button>
      </DropdownTrigger>

      <DropdownMenu
        aria-label="Profile menu"
        className="w-full"
        itemClasses={{
          base: "rounded-xl",
        }}
      >
        {/* Profile Header */}
        <DropdownSection showDivider>
          <DropdownItem
            key="profile-header"
            isReadOnly
            className="h-auto cursor-default px-3 py-2 data-[hover=true]:bg-transparent"
            textValue={`${name} ${role}`}
          >
            <div className="flex items-center gap-3">
              <Avatar
                src={avatarUrl}
                name={name}
                size="lg"
                classNames={{
                  base: "bg-[#FFE8E1]",
                  name: "font-bold text-[#FF5E3A]",
                }}
              />

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-[#2D2120]">
                  {name}
                </p>

                <p className="truncate text-xs text-[#7A6664]">
                  {email}
                </p>

                <div className="mt-1.5 inline-flex items-center rounded-full bg-[#FFF0EB] px-2 py-0.5">
                  <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-[#FF5E3A]" />

                  <span className="text-[10px] font-semibold text-[#FF5E3A]">
                    Role: {role}
                  </span>
                </div>
              </div>
            </div>
          </DropdownItem>
        </DropdownSection>

        {/* Wallet */}
        <DropdownSection>
          <DropdownItem
            key="wallet"
            startContent={
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFF4DD] text-[#FF9F43]">
                <Wallet size={17} />
              </div>
            }
            endContent={<ChevronRight size={16} className="text-[#A18C88]" />}
            textValue="Wallet"
          >
            <div>
              <p className="text-xs text-[#7A6664]">Saldo Wallet</p>

              <p className="text-sm font-bold text-[#2D2120]">
                {balance}
              </p>
            </div>
          </DropdownItem>
        </DropdownSection>

        <DropdownSection showDivider>
          <DropdownItem
            key="profile"
            startContent={
              <UserRound size={18} className="text-[#7A6664]" />
            }
          >
            <span className="text-sm font-medium text-[#2D2120]">
              Profil Saya
            </span>
          </DropdownItem>

          <DropdownItem
            key="classes"
            startContent={
              <BookOpen size={18} className="text-[#7A6664]" />
            }
          >
            <span className="text-sm font-medium text-[#2D2120]">
              Kelas Saya
            </span>
          </DropdownItem>

          <DropdownItem
            key="settings"
            startContent={
              <Settings size={18} className="text-[#7A6664]" />
            }
          >
            <span className="text-sm font-medium text-[#2D2120]">
              Pengaturan
            </span>
          </DropdownItem>

          <DropdownItem
            key="help"
            startContent={
              <CircleHelp size={18} className="text-[#7A6664]" />
            }
          >
            <span className="text-sm font-medium text-[#2D2120]">
              Pusat Bantuan
            </span>
          </DropdownItem>
        </DropdownSection>

        {/* Logout */}
        <DropdownSection>
          <DropdownItem
            key="logout"
            startContent={<LogOut size={18} />}
            className="text-[#E5484D] data-[hover=true]:bg-[#FFF0F0]"
            onPress={onLogout}
          >
            <span className="text-sm font-semibold">Keluar</span>
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
}