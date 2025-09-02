import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface PageHeaderProps {
  title: string
  description?: string
  breadcrumbs?: Array<{ label: string; href?: string }>
}

export function PageHeader({ title, description, breadcrumbs }: PageHeaderProps) {
  return (
    <div className="bg-[#C6D8F9] py-16">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold text-blue-900 mb-4">{title}</h1>
        {description && <p className="text-gray-600 mb-6 max-w-2xl mx-auto">{description}</p>}
        {breadcrumbs && (
          <div className="flex items-center justify-center gap-2 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center gap-2">
                {crumb.href ? (
                  <Link href={crumb.href} className="text-blue-600 hover:text-blue-800">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-gray-500">{crumb.label}</span>
                )}
                {index < breadcrumbs.length - 1 && <ChevronRight className="h-4 w-4 text-gray-400" />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
