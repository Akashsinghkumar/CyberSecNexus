import React from 'react';
import { cn } from '../lib/utils';
import { Loader2 } from 'lucide-react';

const Button = React.forwardRef(({ className, variant = 'default', size = 'default', isLoading, children, ...props }, ref) => {
    const variants = {
        default: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-[0_4px_15px_rgba(37,99,235,0.2)]",
        orange: "bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700 shadow-[0_4px_15px_rgba(234,88,12,0.2)]",
        outline: "border-[1.5px] border-gray-200 bg-white hover:bg-gray-50 text-gray-700 hover:border-gray-300",
        ghost: "hover:bg-gray-100 text-gray-700",
        danger: "bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700 shadow-[0_4px_15px_rgba(239,68,68,0.2)]",
        glass: "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20",
    };

    const sizes = {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 px-4 text-xs font-bold tracking-tight",
        lg: "h-13 px-10 text-base",
        icon: "h-11 w-11 p-0 flex items-center justify-center",
    };

    return (
        <button
            ref={ref}
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-black uppercase tracking-wider transition-all duration-300 active:scale-95 hover:scale-[1.02] disabled:pointer-events-none disabled:opacity-50",
                variants[variant],
                sizes[size],
                className
            )}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {children}
        </button>
    );
});

Button.displayName = "Button";

export { Button };
