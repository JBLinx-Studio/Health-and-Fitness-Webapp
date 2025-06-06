import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { UserProfile } from '@/types/health';
import { cn } from '@/lib/utils';

export interface UserAvatarProps {
  userProfile: UserProfile | null;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showStatus?: boolean;
  statusColor?: 'green' | 'yellow' | 'red' | 'gray' | 'blue' | 'purple';
  onClick?: () => void;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ 
  userProfile, 
  className = "",
  size = 'md',
  showStatus = false,
  statusColor = 'green',
  onClick
}) => {
  const [imageError, setImageError] = useState(false);
  
  // Get user's initials for the fallback
  const getInitials = () => {
    if (!userProfile || !userProfile.name) return "U";
    
    const nameParts = userProfile.name.split(' ');
    if (nameParts.length > 1) {
      return `${nameParts[0][0]}${nameParts[1][0]}`;
    }
    
    return nameParts[0][0] || "U";
  };

  // Use only the avatar property from UserProfile
  const getAvatarSrc = () => {
    if (imageError) return "";
    return userProfile?.avatar || "/placeholder.svg";
  };

  // Size classes
  const sizeClasses = {
    xs: "w-6 h-6 text-xs",
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10",
    lg: "w-14 h-14 text-lg",
    xl: "w-20 h-20 text-xl"
  };
  
  // Status color classes
  const statusColorClasses = {
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    red: "bg-red-500",
    gray: "bg-gray-500",
    blue: "bg-blue-500",
    purple: "bg-cosmic-nebula"
  };

  // Different avatar borders based on size for more cosmic aesthetics
  const getBorderClass = (size: string) => {
    switch(size) {
      case 'xl':
        return "ring-[3px] ring-offset-2 ring-offset-background";
      case 'lg':
        return "ring-2 ring-offset-2 ring-offset-background";
      case 'xs':
        return "ring-1 ring-offset-1 ring-offset-background";
      default:
        return "ring-2 ring-offset-2 ring-offset-background";
    }
  };

  return (
    <div className="relative inline-block group">
      <Avatar 
        className={cn(
          `${sizeClasses[size]} transition-all duration-300 transform group-hover:scale-105`,
          showStatus ? `${getBorderClass(size)} ring-cosmic-highlight` : 
                      `${getBorderClass(size)} ring-cosmic-nebula/40 group-hover:ring-cosmic-nebula`,
          onClick && "cursor-pointer backdrop-blur-sm",
          "bg-gradient-to-br from-cosmic-nebula/20 to-cosmic-highlight/20 overflow-hidden",
          className
        )}
        onClick={onClick}
      >
        <AvatarImage 
          src={getAvatarSrc()} 
          alt={userProfile?.name || "User"} 
          className="object-cover"
          onError={() => setImageError(true)}
        />
        <AvatarFallback className="bg-gradient-to-br from-cosmic-nebula to-cosmic-highlight text-white font-medium animate-shimmer">
          {getInitials()}
        </AvatarFallback>
      </Avatar>
      
      {showStatus && (
        <span 
          className={cn(
            "absolute bottom-0 right-0 rounded-full border-2 border-background animate-pulse",
            size === 'xs' ? "w-2 h-2" : size === 'sm' ? "w-2.5 h-2.5" : size === 'xl' ? "w-4 h-4" : "w-3 h-3",
            statusColorClasses[statusColor]
          )}
        />
      )}

      <span className="absolute inset-0 rounded-full bg-cosmic-nebula/0 group-hover:bg-cosmic-nebula/10 transition-all duration-300 -z-10 blur-md group-hover:blur-lg"></span>
      
      {(size === 'lg' || size === 'xl') && (
        <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute w-full h-full rounded-full border border-cosmic-nebula/20 animate-spin-slow"></div>
          <div className="absolute w-[120%] h-[120%] -left-[10%] -top-[10%] rounded-full border border-cosmic-highlight/10 animate-spin-reverse-slow"></div>
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
