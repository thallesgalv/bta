import { Crosshair, Swords } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [{ to: '/', label: 'Hunts', icon: Crosshair, end: true }]

export function Sidebar() {
  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex items-center gap-2.5 px-5 py-6">
        <Swords className="size-6 text-primary" />
        <div>
          <div className="text-lg font-semibold leading-tight text-sidebar-foreground">BTA</div>
          <div className="text-xs leading-tight text-muted-foreground">Bounty Task Analyzer</div>
        </div>
      </div>
      <nav className="flex flex-col gap-1 px-3">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                isActive && 'bg-sidebar-accent text-sidebar-accent-foreground',
              )
            }
          >
            <Icon className="size-4" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
