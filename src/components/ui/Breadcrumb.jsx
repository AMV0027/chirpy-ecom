import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

const Breadcrumb = ({ items }) => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center space-x-2 text-sm text-gray-500">
          <Link
            to="/"
            className="flex items-center hover:text-gray-700 transition-colors"
          >
            <Home className="h-4 w-4 mr-1" />
            Home
          </Link>

          {items.map((item, index) => (
            <React.Fragment key={index}>
              <ChevronRight className="h-4 w-4" />
              {item.link ? (
                <Link
                  to={item.link}
                  className="hover:text-gray-700 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-900 font-medium">{item.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>
    </div>
  )
}

export default Breadcrumb 