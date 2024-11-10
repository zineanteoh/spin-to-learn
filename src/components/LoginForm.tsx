"use client";

import { capitalize } from "@/lib/utils";
import { Button } from "@/shadcn-ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  CardHeader,
} from "@/shadcn-ui/card";
import { Input } from "@/shadcn-ui/input";
import { Label } from "@/shadcn-ui/label";
import { createClientSupabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = useCallback(async () => {
    if (!email || !password) {
      setErrorMessage("Please enter an email and password");
      return;
    }
    setErrorMessage("");

    const supabase = await createClientSupabase();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMessage(capitalize(error.message));
      return;
    }

    router.push("/");
  }, [email, password, router]);

  const handleSignup = useCallback(async () => {
    if (!email || !password) {
      setErrorMessage("Please enter an email and password");
      return;
    }
    setErrorMessage("");

    const supabase = await createClientSupabase();
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    // Clear form and show confirmation message
    setEmail("");
    setPassword("");
    setShowConfirmation(true);
  }, [email, password]);

  if (showConfirmation) {
    return (
      <Card className="mx-auto max-w-sm pt-10">
        <CardContent className="px-10 flex flex-col gap-4">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Check your email</h2>
            <p className="text-muted-foreground">
              We have sent you a confirmation link. Please check your email to
              complete the signup process.
            </p>
          </div>
          <Button onClick={() => setShowConfirmation(false)}>
            Back to Login
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          Gambling for nerds
        </CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent className="px-10">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="hello@vanderbilt.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center gap-4">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {errorMessage && (
            <div className="text-sm text-destructive">{errorMessage}</div>
          )}
          {isSignup ? (
            <Button type="submit" className="w-full" onClick={handleSignup}>
              Sign Up
            </Button>
          ) : (
            <Button type="submit" className="w-full" onClick={handleLogin}>
              Login
            </Button>
          )}
        </div>
        <div className="mt-4 text-center text-sm">
          {isSignup ? (
            <>
              Already have an account?{" "}
              <Button
                variant="link"
                className="p-0 h-auto"
                onClick={() => setIsSignup(false)}
              >
                Login
              </Button>
            </>
          ) : (
            <>
              Don&apos;t have an account?{" "}
              <Button
                variant="link"
                className="p-0 h-auto"
                onClick={() => setIsSignup(true)}
              >
                Sign up
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
