"use client"

import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

export default function Dashboard() {
    const { setAuth, isAuthenticated, user } = useAuth();
    useEffect(() => {
        console.log(user, isAuthenticated)
      }, [isAuthenticated, user])
    return (
        <>Ini Dashboard</>
    )
}