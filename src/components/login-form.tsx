import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { LoginFormData, loginFormSchema } from "@/types/loginForm.type"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Eye, EyeOff, Loader } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { AxiosError } from "axios"
import Link from "next/link"
import createInstance from "@/axios/instance"
import { useAuthStore } from "@/store/useAuthStore"

interface LoginFormProps extends React.ComponentPropsWithoutRef<"form"> {
  className?: string;
}

export function LoginForm({ className, ...props }: LoginFormProps) {
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter()
  const queryClient = useQueryClient()

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const { mutate, isLoading } = useMutation({
    mutationFn: (data: LoginFormData) => createInstance().post("/login", data,),
    onSuccess: (response) => {

      const user = response.data.data;
      useAuthStore.getState().login(user);
      queryClient.invalidateQueries(["allProducts"]);

      toast.success("Successfully logged in")
      const callbackUrl = new URLSearchParams(window.location.search).get("callbackUrl");
      const url = callbackUrl ? `/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/dashboard";
      router.push(url)
    },
    onError: (error: { response: { status: number }; }) => {
      console.log(error);
      if (error.response?.status === 401) {
        toast.error("Your account is inactive")
      }
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Failed to login")
      } else {
        toast.error("An unexpected error occurred")
      }
    },

  })

  const onSubmit = (data: LoginFormData) => {
    mutate(data)
  }



  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-6", className)}
        {...props}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  autoComplete="email"
                  placeholder="your@email.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <div className="flex items-center justify-center relative">
                <FormControl>
                  <Input
                    type={isVisible ? "text" : "password"}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    {...field}
                  />
                </FormControl>
                <button
                  type="button"
                  className="absolute right-4 text-gray-500 hover:text-gray-700"

                  onClick={() => setIsVisible(!isVisible)}
                >
                  {isVisible ? <Eye size={22} /> : <EyeOff size={22} />}
                </button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </Button>
      </form>
      <div className="text-center text-sm mt-2">
        Don&apos;t have an account?{" "}
        <Link href="/auth/register" className="underline  underline-offset-4">
          Sign up
        </Link>
      </div>
    </Form>
  )
}