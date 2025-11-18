import { CircleNotchIcon } from '@phosphor-icons/react/dist/ssr'
import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import React from 'react'

import { cn } from '~/lib/utils'

const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium text-sm outline-none transition-all [&_svg]:pointer-events-none disabled:pointer-events-none [&_svg:not([class*="size-"])]:size-4 [&_svg]:shrink-0 aria-invalid:border-destructive focus-visible:border-ring disabled:opacity-50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 focus-visible:ring-[3px] focus-visible:ring-ring/50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
        destructive:
          'bg-destructive text-background shadow-xs dark:bg-destructive/60 hover:bg-destructive/90 dark:focus-visible:ring-destructive/40 focus-visible:ring-destructive/20',
        outline:
          'border bg-background shadow-xs dark:border-input dark:bg-input/30 dark:hover:bg-input/50 hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
        ghost: 'dark:hover:bg-accent/50 hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  isLoading = false,
  disabled,
  children,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    isLoading?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'
  const isDisabled = disabled || isLoading

  const renderedChildren = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) {
      return child
    }

    // Preserve non-icon children when loading; replace icons with spinner
    if (!isLoading || typeof child.type === 'string') {
      return child
    }

    return <CircleNotchIcon className='size-4 animate-spin' aria-hidden='true' />
  })

  return (
    <Comp
      data-slot='button'
      className={cn(buttonVariants({ variant, size, className }), isLoading && 'cursor-wait')}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      {...props}
    >
      {isLoading && renderedChildren?.length === 0 ? (
        <CircleNotchIcon className='size-4 animate-spin' aria-hidden='true' />
      ) : (
        renderedChildren
      )}
    </Comp>
  )
}

export { Button, buttonVariants }
