"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ProfileAvatarWithSpinningTextProps {
  avatarUrl: string | null;
  fullName: string | null;
  username: string;
  spinningTextEnabled?: boolean;
  spinningTextSet?: string | null;
  /** Posición del avatar (object-position), ej. "50% 50%" */
  avatarPosition?: string | null;
  className?: string;
}

export function ProfileAvatarWithSpinningText({
  avatarUrl,
  fullName,
  username,
  spinningTextEnabled = false,
  spinningTextSet = null,
  avatarPosition = "50% 50%",
  className,
}: ProfileAvatarWithSpinningTextProps) {
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {/* Contenedor: texto visible en anillo alrededor del avatar, sin gap excesivo */}
      <div className="relative w-[160px] h-[160px] flex items-center justify-center">
        {/* SpinningText suspendido de momento */}
        <Avatar className="w-24 h-24 border-2 border-zinc-800 relative z-10 bg-zinc-900">
          <AvatarImage src={avatarUrl || ""} className="object-cover" style={{ objectPosition: avatarPosition || "50% 50%" }} />
          <AvatarFallback className="text-2xl font-bold bg-zinc-800 text-zinc-400">
            {fullName?.[0] || "?"}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
