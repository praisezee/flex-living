"use client"

import Link from "next/link"
import { Building2, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DashboardHeader() {
  return (
    <header className="border-b bg-card sticky top-0 z-20">
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="rounded-lg bg-gradient-to-br from-primary to-primary/80 p-2.5">
            <Building2 className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Flex Living</h1>
            <p className="text-xs text-muted-foreground">Reviews Dashboard</p>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <Home className="h-4 w-4" />
              Home
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
