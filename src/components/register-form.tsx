import createInstance from "@/axios/instance"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { RegisterFormData, registerFormSchema } from "@/types/registerForm.type"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"

interface RegisterFormProps extends React.ComponentPropsWithoutRef<"form"> {
  className?: string;
}

export function RegisterForm({ className, ...props }: RegisterFormProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isVisible2, setIsVisible2] = useState(false)
  const router = useRouter()

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: "",
      password: "",
      fullname: "",
      password_confirmation: "",
    },
  })

  const { mutate, isLoading } = useMutation({
    mutationFn: (data: RegisterFormData) => {
      return createInstance().post("/register", data)
    },
    onSuccess: () => {
      toast.success("Successfully register")
      router.push("/auth/login")
    },
    onError: (error) => {

      if (error instanceof AxiosError) {
        toast.error("Email Already Taken")
      } else {
        toast.error("An unexpected error occurred")
      }
    },
  })

  const onSubmit = (data: RegisterFormData) => {
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
          <h1 className="text-2xl font-bold">Register a new account</h1>
          <p className=" text-sm text-muted-foreground">
            Enter your email and password below to create a new account
          </p>
        </div>

        <FormField
          control={form.control}
          name="fullname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Your Full Name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
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
                    autoComplete="off"
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

        <FormField
          control={form.control}
          name="password_confirmation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <div className="flex items-center justify-center relative">
                <FormControl>
                  <Input
                    type={isVisible2 ? "text" : "password"}
                    placeholder="Confirm Your Password"
                    autoComplete="off"
                    {...field}
                  />
                </FormControl>
                <button
                  type="button"
                  className="absolute right-4 text-gray-500 hover:text-gray-700"
                  onClick={() => setIsVisible2(!isVisible2)}
                >
                  {isVisible2 ? <Eye size={22} /> : <EyeOff size={22} />}
                </button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />


        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging in...
            </>
          ) : (
            "Register"
          )}
        </Button>
      </form>
      <div className="text-center text-sm mt-2">
        Don&apos;t have an account?{" "}
        <Link href="/auth/login" className="underline  underline-offset-4">
          Login
        </Link>
      </div>
    </Form>
  )
}