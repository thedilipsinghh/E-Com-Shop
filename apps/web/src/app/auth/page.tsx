"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Section } from "@/components/Section"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { setUser, clearUser } from "@/redux/slices/authSlice"
import { useSigninMutation, useSignupMutation } from "@/redux/apis/auth.api"
import { useToast } from "@/components/Toast"
import { Eye, EyeOff, ImagePlus } from "lucide-react"

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  mobile: z.string().min(10, "Mobile must be at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  profilePic: z.string().optional(),
})

type LoginForm = z.infer<typeof loginSchema>
type RegisterForm = z.infer<typeof registerSchema>

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [profilePic, setProfilePic] = useState<string>("")
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { showSuccess, showError } = useToast() 
  
  const [signin, { isLoading: loginLoading }] = useSigninMutation()
  const [signup, { isLoading: registerLoading }] = useSignupMutation()
  
  const { user } = useAppSelector((state: any) => state.auth || {})
  
  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })
  
  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", mobile: "", password: "" },
  })

  const onLogin = async (data: LoginForm) => {
    try {
      const result: any = await signin(data).unwrap()
      if (result.success) {
        dispatch(setUser({ user: result.data.user, token: result.data.token }))
        showSuccess("Login successful!")
        router.push("/")
      }
    } catch (error: any) {
      showError(error.data?.message || "Login failed")
    }
  }

  const onRegister = async (data: RegisterForm) => {
    try {
      const result: any = await signup({ ...data, profilePic: profilePic || undefined }).unwrap()
      if (result.success) {
        dispatch(setUser({ user: result.data.user, token: result.data.token }))
        showSuccess("Registration successful!")
        router.push("/")
      }
    } catch (error: any) {
      showError(error.data?.message || "Registration failed")
    }
  }

  if (user) {
    router.push("/account")
    return null
  }

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-10rem)] py-16">
        <Section>
          <div className="mx-auto max-w-md">
            <div className="rounded-2xl border border-border bg-background p-8">
              <h1 className="text-2xl font-semibold text-center mb-6">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h1>
              
              <div className="flex gap-2 mb-6">
                <Button
                  variant={isLogin ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setIsLogin(true)}
                >
                  Login
                </Button>
                <Button
                  variant={isLogin ? "outline" : "default"}
                  className="flex-1"
                  onClick={() => setIsLogin(false)}
                >
                  Register
                </Button>
              </div>

              {isLogin ? (
                <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      {...loginForm.register("email")}
                      type="email"
                      placeholder="Enter your email"
                    />
                    {loginForm.formState.errors.email && (
                      <p className="text-sm text-destructive mt-1">
                        {loginForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium">Password</label>
                    <div className="relative">
                      <Input
                        {...loginForm.register("password")}
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {loginForm.formState.errors.password && (
                      <p className="text-sm text-destructive mt-1">
                        {loginForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>
                  <Button type="submit" className="w-full" disabled={loginLoading}>
                    {loginLoading ? "Logging in..." : "Login"}
                  </Button>
                </form>
              ) : (
                <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <Input
                      {...registerForm.register("name")}
                      placeholder="Enter your name"
                    />
                    {registerForm.formState.errors.name && (
                      <p className="text-sm text-destructive mt-1">
                        {registerForm.formState.errors.name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      {...registerForm.register("email")}
                      type="email"
                      placeholder="Enter your email"
                    />
                    {registerForm.formState.errors.email && (
                      <p className="text-sm text-destructive mt-1">
                        {registerForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium">Mobile</label>
                    <Input
                      {...registerForm.register("mobile")}
                      type="tel"
                      placeholder="Enter your mobile number"
                    />
                    {registerForm.formState.errors.mobile && (
                      <p className="text-sm text-destructive mt-1">
                        {registerForm.formState.errors.mobile.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium">Password</label>
                    <div className="relative">
                      <Input
                        {...registerForm.register("password")}
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {registerForm.formState.errors.password && (
                      <p className="text-sm text-destructive mt-1">
                        {registerForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>
                  <Button type="submit" className="w-full" disabled={registerLoading}>
                    {registerLoading ? "Creating account..." : "Register"}
                  </Button>
                  
                  <div>
                    <label className="text-sm font-medium">Profile Picture</label>
                    <div className="mt-2 flex items-center gap-4">
                      {profilePic ? (
                        <div className="relative w-20 h-20 rounded-full overflow-hidden border">
                          <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setProfilePic("")}
                            className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity"
                          >
                            <EyeOff className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="w-20 h-20 rounded-full border-2 border-dashed border-muted-foreground flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                          <ImagePlus className="h-8 w-8 text-muted-foreground" />
                          <input
                            type="text"
                            value={profilePic}
                            onChange={(e) => setProfilePic(e.target.value)}
                            className="hidden"
                            placeholder="Paste image URL"
                          />
                        </label>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Paste an image URL (e.g., from Google Images)
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  )
}