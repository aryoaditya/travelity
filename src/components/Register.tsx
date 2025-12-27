import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { register as registerUser } from "@/api/auth.api";
import { SpinnerCustom } from "./ui/spinner";

const registerSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmationPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmationPassword, {
    message: "Passwords do not match",
    path: ["confirmationPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmationPassword, setShowConfirmationPassword] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);

    try {
      await registerUser(data.username, data.email, data.password);

      toast.success("Your account has been successfully created");
      navigate("/login");
    } catch (err: any) {
      const message =
        err.response?.data?.error?.message ||
        "Registration failed, please try again";

      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold text-primary-foreground">
                T
              </span>
            </div>
            <span className="text-2xl font-bold text-foreground">
              Travelity
            </span>
          </div>
        </div>

        {/* Login Card */}
        <Card className="border-border shadow-soft">
          <CardHeader className="space-y-1 pb-4">
            <h2 className="text-xl font-semibold text-center text-foreground">
              Register
            </h2>
            <p className="text-sm text-muted-foreground text-center">
              Register your account to continue
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Username */}
              <div className="space-y-1">
                <Label>Username</Label>
                <Input placeholder="Username" {...register("username")} />
                {errors.username && (
                  <p className="text-sm text-red-500">
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1">
                <Label>Email</Label>
                <Input placeholder="Email" {...register("email")} />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1">
                <Label>Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirmation Password */}
              <div className="space-y-1">
                <Label>Confirm Password</Label>
                <div className="relative">
                  <Input
                    type={showConfirmationPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    {...register("confirmationPassword")}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmationPassword(!showConfirmationPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showConfirmationPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.confirmationPassword && (
                  <p className="text-sm text-red-500">
                    {errors.confirmationPassword.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full mt-8"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex justify-center items-center">
                    <SpinnerCustom className="size-4 text-white" />
                  </div>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>

            {/* Sign In Link */}
            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have an account?{" "}
              <button
                onClick={() => {
                  navigate("/login");
                }}
                type="button"
                className="text-primary hover:underline font-medium"
              >
                Sign In
              </button>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
