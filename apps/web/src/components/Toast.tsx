"use client"

import { Toaster, toast } from "sonner"

// Custom toast hooks for different types
export const useToast = () => {
  const showSuccess = (message: string) => {
    toast.success(message, {
      description: "Success",
      action: {
        label: "Close",
        onClick: () => toast.dismiss()
      }
    })
  }

  const showError = (message: string) => {
    toast.error(message, {
      description: "Error",
      action: {
        label: "Close",
        onClick: () => toast.dismiss()
      }
    })
  }

  const showInfo = (message: string) => {
    toast.info(message, {
      description: "Info",
      action: {
        label: "Close",
        onClick: () => toast.dismiss()
      }
    })
  }

  const showWarning = (message: string) => {
    toast.warning(message, {
      description: "Warning",
      action: {
        label: "Close",
        onClick: () => toast.dismiss()
      }
    })
  }

  return { showSuccess, showError, showInfo, showWarning }
}

// ToastProvider component to wrap the app
export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <Toaster 
        position="top-right"
        richColors
        toastOptions={{
          duration: 5000,
        }}
      />
    </>
  )
}
