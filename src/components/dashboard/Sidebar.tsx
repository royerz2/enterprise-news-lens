
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

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="flex h-full w-64 flex-col bg-gradient-to-b from-slate-900 to-slate-800 shadow-xl">
      <div className="flex h-16 shrink-0 items-center px-6">
        <h1 className="text-xl font-bold text-white">SME News Analytics</h1>
      </div>
      
      <nav className="flex flex-1 flex-col px-4 pb-4">
        <ul role="list" className="flex flex-1 flex-col gap-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={cn(
                    'group flex gap-x-3 rounded-lg p-3 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  )}
                >
                  <item.icon
                    className={cn(
                      'h-5 w-5 shrink-0 transition-colors duration-200',
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                    )}
                  />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
