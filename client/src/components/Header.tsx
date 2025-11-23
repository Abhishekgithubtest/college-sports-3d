import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { Trophy, Home, Calendar, Users, Award, Shield, Zap, BarChart3 } from "lucide-react";

export function Header() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/schedule", label: "Schedule", icon: Calendar },
    { href: "/rankings", label: "Rankings", icon: Trophy },
    { href: "/players", label: "Players", icon: Users },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
  ];

  const adminItems = [
    { href: "/admin", label: "Admin", icon: Shield },
    { href: "/referee", label: "Referee", icon: Zap },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer hover-elevate px-3 py-2 rounded-md" data-testid="link-home">
            <Trophy className="w-8 h-8 text-primary" />
            <div className="hidden sm:block">
              <div className="text-xl font-bold font-display leading-none">CollegeSports</div>
              <div className="text-xs text-muted-foreground">Live Scoring</div>
            </div>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}>
              <Button
                variant={location === href ? "default" : "ghost"}
                size="sm"
                className="gap-2"
                data-testid={`nav-${label.toLowerCase()}`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden md:inline">{label}</span>
              </Button>
            </Link>
          ))}
          
          <div className="w-px h-6 bg-border mx-2" />
          
          {adminItems.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}>
              <Button
                variant={location === href ? "default" : "ghost"}
                size="sm"
                className="gap-2"
                data-testid={`nav-${label.toLowerCase()}`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden md:inline">{label}</span>
              </Button>
            </Link>
          ))}
        </nav>

        {/* Theme Toggle */}
        <ThemeToggle />
      </div>
    </header>
  );
}
