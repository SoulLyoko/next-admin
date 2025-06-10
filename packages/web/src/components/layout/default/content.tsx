'use client'

export default function LayoutSider({ children }: { children: React.ReactNode }) {
  return (
    <ALayout.Content className="p-5">
      <div className="rd-lg h-full bg-white">
        {children}
      </div>
    </ALayout.Content>
  )
}
