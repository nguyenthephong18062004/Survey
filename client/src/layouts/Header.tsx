import { Outlet } from 'react-router-dom'

export function Header() {
  return (
    <div className="flex flex-col min-h-screen bg-[#eef1f5]">
      <main className="flex-1 p-[1.75rem_1.25rem_3rem] max-w-[1180px] mx-auto w-full box-border">
        <Outlet />
      </main>
    </div>
  )
}
