
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart, 
  FileText, 
  Heart, 
  Grid3x3, 
  PieChart, 
  TrendingUp 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Overview', href: '/', icon: BarChart },
  { name: 'Articles', href: '/articles', icon: FileText },
  { name: 'Sentiment', href: '/sentiment', icon: Heart },
  { name: 'Problems', href: '/problems', icon: TrendingUp },
  { name: 'Clusters', href: '/clusters', icon: Grid3x3 },
  { name: 'Network', href: '/network', icon: PieChart },
];

export function Navbar() {
  const location = useLocation();

  return (
    <nav className="bg-gradient-to-r from-slate-900 to-slate-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-white">SME News Analytics</h1>
          </div>
          
          <div className="flex space-x-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
