"use client"

import { Button, Input } from "@heroui/react"
import { Search, WalletIcon } from "lucide-react"
import Image from "next/image"
import { ReactNode, useState } from "react"
import { ProfileDropdown } from "./Profile"
import { NotificationDropdown } from "./Notification"
import Link from "next/link"

export const PanelLayout = ({ children }: { children: ReactNode }) => {
    const [search, setSearch] = useState<string>("")

    const price = 150000

    return (
        <main className="bg-panel-background min-h-screen">
            <header className="container mx-auto px-4 py-4">
                <nav>
                    <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-6">
                        
                        {/* Logo */}
                        <Link href="/panel" className="flex items-center gap-2 shrink-0">
                            <Image
                                src="/images/logo.png"
                                alt="Logo"
                                width={44}
                                height={44}
                                className="md:h-auto h-8 md:w-auto w-8"
                            />

                            <div className="md:text-xl text-sm font-extrabold whitespace-nowrap md:block flex flex-col gap-0">
                                <span>Loka</span>
                                <span className="text-primary">Pintar</span>
                            </div>
                        </Link>

                        {/* Search */}
                        <div className="min-w-0 md:block hidden">
                            <Input
                                startContent={<Search className="text-muted/60" size={18} />}
                                aria-label="Search"
                                radius="full"
                                variant="bordered"
                                placeholder="Find classes, articles, or UMKM products."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                classNames={{
                                    input: "placeholder:text-muted/60 placeholder:italic text-sm",
                                    inputWrapper: "border-1 border-primary/40 shadow-sm"
                                }}
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                            <Button variant="bordered" className="border-1 border-primary/40 bg-primary/5 shadow-sm">
                                <WalletIcon className="text-primary" size={18} />
                                <span className="ml-2 text-sm font-bold">
                                    Rp {price.toLocaleString("id-ID")}
                                </span>
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
