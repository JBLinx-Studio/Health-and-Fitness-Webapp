
import React, { useRef, useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useViewport } from '@/hooks';
import { cn } from '@/lib/utils';
import { throttle } from '@/utils/performance';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavigationTab {
  name: string;
  path: string;
  icon?: React.ReactNode;
}

interface NavigationTabsProps {
  tabs: NavigationTab[];
  className?: string;
}

const NavigationTabs: React.FC<NavigationTabsProps> = ({ tabs, className = '' }) => {
  const location = useLocation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const { isMobile, isTablet, width } = useViewport();
  
  const checkForArrows = () => {
    const container = scrollContainerRef.current;
    if (!container || isMobile) return;
    
    setShowLeftArrow(container.scrollLeft > 20);
    setShowRightArrow(container.scrollLeft < container.scrollWidth - container.clientWidth - 20);
  };
  
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const activeTab = container.querySelector('.active-tab');
    if (activeTab) {
      const tabRect = activeTab.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      
      if (tabRect.left < containerRect.left || tabRect.right > containerRect.right) {
        activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
    
    setTimeout(checkForArrows, 300);
  }, [location.pathname]);
  
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const handleScroll = throttle(() => {
      checkForArrows();
    }, 100);
    
    container.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    
    checkForArrows();
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);
  
  const scrollLeft = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };
  
  const scrollRight = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  // Mobile optimization: show only essential tabs + overflow menu
  const visibleTabs = isMobile ? tabs.slice(0, 3) : tabs;
  const overflowTabs = isMobile ? tabs.slice(3) : [];

  const containerClass = cn(
    "relative backdrop-blur-2xl rounded-2xl md:rounded-3xl shadow-2xl border mx-auto max-w-fit transition-all duration-300",
    "ring-1 ring-white/20 dark:ring-slate-700/20",
    isMobile 
      ? "bg-white/95 dark:bg-slate-900/95 border-gray-200/80 dark:border-gray-700/80 p-1 mx-1" 
      : "bg-white/95 dark:bg-slate-900/95 border-gray-200/60 dark:border-gray-700/60 p-2 md:p-3",
    className
  );

  const scrollContainerClass = cn(
    "flex overflow-x-auto scrollbar-none scroll-smooth gap-1 py-1 md:py-2",
    isMobile ? "px-1" : "px-8 md:px-12"
  );

  const getTabClass = (isActive: boolean) => cn(
    "flex items-center whitespace-nowrap rounded-xl md:rounded-2xl transition-all duration-300 font-semibold group relative overflow-hidden min-w-fit border",
    "hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-1",
    isMobile 
      ? "gap-1 px-2 py-1.5 text-xs min-w-[60px] justify-center" 
      : isTablet 
        ? "gap-2 px-3 py-2 text-sm min-w-[80px]" 
        : "gap-3 px-4 md:px-6 py-2 md:py-3 text-sm min-w-fit",
    isActive 
      ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-xl shadow-blue-500/30 active-tab transform scale-[1.02] border-blue-400/50" 
      : "text-gray-700 dark:text-gray-200 bg-white/60 dark:bg-slate-800/60 hover:bg-white/80 dark:hover:bg-slate-800/80 hover:shadow-lg border-gray-200/50 dark:border-gray-700/50"
  );

  return (
    <div className={containerClass}>
      <div className="flex items-center relative">
        {showLeftArrow && !isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 z-20 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-200/60 dark:border-gray-700/60 h-8 w-8 md:h-9 md:w-9"
            onClick={scrollLeft}
            aria-label="Scroll tabs left"
          >
            <ChevronLeft className="h-4 w-4 text-gray-700 dark:text-gray-300" />
          </Button>
        )}
        
        <div
          ref={scrollContainerRef}
          className={scrollContainerClass}
          style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
        >
          {visibleTabs.map(tab => {
            const isActive = location.pathname === tab.path;
            return (
              <NavLink
                key={tab.path}
                to={tab.path}
                className={getTabClass(isActive)}
                role="tab"
                aria-selected={isActive}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {tab.icon && (
                  <span className={cn(
                    "relative z-10 transition-transform duration-300 group-hover:scale-110 flex-shrink-0",
                    isMobile ? "text-sm" : "text-base md:text-lg"
                  )}>
                    {tab.icon}
                  </span>
                )}
                
                <span className={cn(
                  "relative z-10 font-semibold leading-tight",
                  isMobile && tab.name.length > 6 ? "hidden" : ""
                )}>
                  {isMobile && tab.name.length > 6 ? tab.name.slice(0, 4) + '..' : tab.name}
                </span>
                
                {isActive && (
                  <div className="absolute bottom-0.5 md:bottom-1 left-1/2 transform -translate-x-1/2 w-6 md:w-8 h-0.5 md:h-1 bg-white/90 rounded-full shadow-lg animate-pulse"></div>
                )}
              </NavLink>
            );
          })}
          
          {/* Overflow menu for mobile */}
          {isMobile && overflowTabs.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "flex items-center gap-1 px-2 py-1.5 text-xs min-w-[40px] justify-center rounded-xl transition-all duration-300 font-semibold group relative overflow-hidden border",
                    "text-gray-700 dark:text-gray-200 bg-white/60 dark:bg-slate-800/60 hover:bg-white/80 dark:hover:bg-slate-800/80 hover:shadow-lg border-gray-200/50 dark:border-gray-700/50"
                  )}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-gray-200/60 dark:border-gray-700/60" align="end">
                {overflowTabs.map(tab => (
                  <DropdownMenuItem key={tab.path} asChild>
                    <NavLink
                      to={tab.path}
                      className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-800"
                    >
                      {tab.icon}
                      {tab.name}
                    </NavLink>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        
        {showRightArrow && !isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 z-20 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-200/60 dark:border-gray-700/60 h-8 w-8 md:h-9 md:w-9"
            onClick={scrollRight}
            aria-label="Scroll tabs right"
          >
            <ChevronRight className="h-4 w-4 text-gray-700 dark:text-gray-300" />
          </Button>
        )}
      </div>

      {/* Enhanced visual effects */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 md:h-1 bg-gradient-to-r from-transparent via-blue-500/60 to-transparent rounded-full animate-pulse"></div>
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl md:rounded-3xl opacity-0 hover:opacity-100 blur-xl transition-opacity duration-500 -z-10"></div>
    </div>
  );
};

export default NavigationTabs;
