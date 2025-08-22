export function BreadcrumbNav({ className }: { className?: string }) {
  return (
    <nav className={className}>
      <ol className="flex items-center space-x-2 text-sm text-gray-500">
        <li>Home</li>
        <li>/</li>
        <li>Dashboard</li>
      </ol>
    </nav>
  );
}