export default function LayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <ALayout.Content className="p-5 of-auto">
      <div className="rd-lg bg-white h-full">
        {children}
      </div>
    </ALayout.Content>
  )
}
