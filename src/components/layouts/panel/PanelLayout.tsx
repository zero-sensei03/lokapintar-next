"use client"

import { Button, Input } from "@heroui/react"
import { Search, WalletIcon } from "lucide-react"
import Image from "next/image"
import { ReactNode, useState } from "react"
import { ProfileDropdown } from "./Profile"
import { NotificationDropdown } from "./Notification"

export const PanelLayout = ({ children }: { children: ReactNode }) => {
    const [ search, setSearch ] = useState<string>("")
  return (
    <main className="bg-panel-background">
        <header className="container mx-auto px-4 py-4">
            <nav>
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <Image src="/images/logo.png" alt="Logo" width={44} height={44} />
                        <div className="font-caacupe-one text-xl font-extrabold">
                            <span>Loka</span>
                            <span className="text-primary">Pintar</span>
                        </div>
                    </div>
                    <div>
                        <Input
                            startContent={<Search size={20} />}
                            aria-label="Search"
                            radius="lg"
                            placeholder="Find classes, articles, or UMKM products."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Button>
                            <WalletIcon size={20} />
                            <span>Rp 0</span>
                        </Button>
                        <NotificationDropdown />
                        <ProfileDropdown />
                    </div>
                </div>
            </nav>
        </header>
    {children}        
    </main>
  )
}