"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"
import Checkbox from "@/components/checkbox"
import { Input } from "@/components/input"
import { MainButton } from "@/components/mainButton"
import {
  fontBigTypoDesktop,
  fontBodyLinkNormal,
  fontBodyNormal,
  fontCaptionBold,
  fontTitle1,
  fontTitle2,
} from "@/styles/typography"

const SignIn = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
  }

  return (
    <div className="flex h-screen w-full">
      {/* Left Side - Hidden on medium screens and below */}
      <div className="relative hidden p-4 md:block md:w-[480px] xl:w-[600px]">
        <div className="relative h-full w-full overflow-hidden rounded-5">
          <Image
            src="/signin.png"
            alt="Sign In"
            fill
            className="rounded-5 object-cover"
            priority
          />
          <div className="absolute inset-0 rounded-5 bg-signIn" />
          <div className="absolute bottom-0 left-0 right-0 h-1/2 rounded-b-5 bg-gradient-to-t from-black via-black via-50% to-transparent opacity-50" />

          <div className="relative z-10 flex h-full flex-col p-6">
            <div className="flex items-center gap-2">
              <Image
                src="/orderificLogo-icon.svg"
                alt="Orderific Logo"
                width={56}
                height={56}
              />
              <span className={cn(fontTitle1, "text-white-100")}>
                Orderific
              </span>
            </div>

            <div className="mt-auto">
              <h1 className={cn(fontBigTypoDesktop, "mb-4 text-white-100")}>
                Service Panel
              </h1>
              <p className={cn(fontBodyNormal, "text-white-100")}>
                Streamline your restaurant operations with BMS. Manage
                reservations, orders, inventory, and staff effortlessly, and
                focus on delivering exceptional dining experiences.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex flex-1 flex-col px-4 md:px-8 lg:px-12">
        {/* Mobile Logo */}
        <div className="mt-8 flex flex-col items-center gap-2 md:hidden">
          <div className="flex items-center gap-2">
            <Image
              src="/orderificBrandLogo.png"
              alt="Orderific Logo"
              width={56}
              height={56}
            />
            <span className={cn(fontTitle2, "text-brand")}>Orderific</span>
          </div>
          <span className={cn(fontTitle1, "text-black-100")}>
            Service Panel
          </span>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-[440px]">
            <div className="mb-8 text-center">
              <h2 className={cn(fontTitle1, "mb-2")}>Welcome Back</h2>
              <p className={cn(fontBodyNormal, "text-black-60")}>
                Manage, streamline, and thrive effortlessly.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className={cn(fontCaptionBold, "pl-2 text-black-60")}>
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  variant="signin"
                />
              </div>

              <div className="space-y-2">
                <label className={cn(fontCaptionBold, "pl-2 text-black-60")}>
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    variant="signin"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <Image
                      src={showPassword ? "/eyeoff.svg" : "/eye.svg"}
                      alt={showPassword ? "Hide password" : "Show password"}
                      width={24}
                      height={24}
                    />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={rememberMe}
                    onClick={() => setRememberMe(!rememberMe)}
                  />
                  <span className={cn(fontBodyNormal)}>Remember me</span>
                </div>
                <Link
                  href="/login-with-code"
                  className={cn(fontBodyLinkNormal, "font-bold underline")}
                >
                  Login with Code
                </Link>
              </div>

              <MainButton
                type="submit"
                variant="primary"
                className="w-full"
                disabled={!email || !password}
              >
                Sign In
              </MainButton>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignIn
