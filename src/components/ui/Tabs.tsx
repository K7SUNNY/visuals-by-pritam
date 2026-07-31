import { createContext, useContext, useState } from 'react'
import { cn } from '@/lib/utils/cn'
import { type ReactNode } from 'react'

interface TabsContextValue {
  value: string
  onValueChange: (value: string) => void
}

const TabsContext = createContext<TabsContextValue | null>(null)

function useTabsContext() {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error('Tabs compound components must be used within <Tabs>')
  }
  return context
}

interface TabsProps {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  children: ReactNode
  className?: string
}

function Tabs({
  defaultValue,
  value,
  onValueChange,
  children,
  className,
}: TabsProps) {
  const [activeValue, setActiveValue] = useState(defaultValue ?? '')

  const handleValueChange = (val: string) => {
    setActiveValue(val)
    onValueChange?.(val)
  }

  const contextValue = {
    value: value ?? activeValue,
    onValueChange: handleValueChange,
  }

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={cn('w-full', className)}>{children}</div>
    </TabsContext.Provider>
  )
}

interface TabListProps {
  children: ReactNode
  className?: string
}

function TabList({ children, className }: TabListProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-1 border-b border-divider',
        className
      )}
      role="tablist"
    >
      {children}
    </div>
  )
}

interface TabProps {
  children: ReactNode
  value: string
  className?: string
}

function Tab({ children, value, className }: TabProps) {
  const { value: activeValue, onValueChange } = useTabsContext()
  const isActive = activeValue === value

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      className={cn(
        'relative px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-t-lg',
        isActive
          ? 'text-primary border-b-2 border-primary'
          : 'text-text-secondary hover:text-text hover:bg-surface-secondary',
        className
      )}
      onClick={() => onValueChange(value)}
    >
      {children}
    </button>
  )
}

interface TabPanelProps {
  children: ReactNode
  value: string
  className?: string
}

function TabPanel({ children, value, className }: TabPanelProps) {
  const { value: activeValue } = useTabsContext()

  if (activeValue !== value) return null

  return (
    <div role="tabpanel" className={cn('pt-4', className)}>
      {children}
    </div>
  )
}

Tabs.TabList = TabList
Tabs.Tab = Tab
Tabs.TabPanel = TabPanel

export { Tabs, TabList, Tab, TabPanel }