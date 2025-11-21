import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "./utils"

const Switch = React.forwardRef(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      // STARS indicate the important styling changes for the large green look
      // ✨ h-[28px] w-[52px]: Sets the large size of the track
      // ✨ data-[state=checked]:bg-[#34C759]: Sets the vibrant green color when active
      // ✨ data-[state=unchecked]:bg-gray-300: Sets the light gray color when inactive
      "peer inline-flex h-[28px] w-[52px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[#34C759] data-[state=unchecked]:bg-gray-300",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        // ✨ h-6 w-6: Sets the large size of the white circle (thumb)
        // ✨ translate-x-6: Sets how far it moves to the right (must match track width)
        "pointer-events-none block h-6 w-6 rounded-full bg-white shadow-md ring-0 transition-transform data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-0"
      )}
    />
  </SwitchPrimitives.Root>
))

Switch.displayName = "Switch"

export { Switch }