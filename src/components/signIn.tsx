"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { EyeIcon, EyeOffIcon } from "@/icons"

import { cn } from "@/lib/utils"
import Checkbox from "@/components/checkbox"
import { CodeInput } from "@/components/codeInput"
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

export default function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isCodeLogin, setIsCodeLogin] = useState(false)
  const [code, setCode] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

  const toggleLoginMethod = () => {
    setIsCodeLogin(!isCodeLogin)
  }

  return (
    <div className="flex h-screen w-full p-4">
      {/* Left Side - Image Section */}
      <div className="relative hidden min-w-[480px] lg:block lg:w-[480px] xl:w-[600px]">
        <div className="relative h-full overflow-hidden rounded-5">
          <Image
            src="/signin.png"
            alt="Sign In"
            className="object-cover"
            fill
            priority
          />
          <div className="absolute inset-0 bg-signIn" />
          <div className="absolute bottom-0 left-0 h-1/3 w-full bg-gradient-to-b from-transparent via-black to-black opacity-50" />

          {/* Content Container */}
          <div className="absolute inset-0 flex h-full w-full flex-col justify-between p-8">
            {/* Logo */}
            <Image
              src="/WhiteLogo-withText.svg"
              alt="Logo"
              width={168}
              height={56}
              priority
            />

            {/* Title & Description */}
            <div className="space-y-6">
              <h1 className={cn(fontBigTypoDesktop, "text-white-100")}>
                Service Panel
              </h1>
              <p
                className={cn(fontBodyNormal, "leading-[20px] text-white-100")}
              >
                Streamline your restaurant operations with BMS. Manage
                reservations, orders, inventory, and staff effortlessly, and
                focus on delivering exceptional dining experiences.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form Section */}
      <div className="relative flex w-full items-center justify-center">
        {/* Mobile/Tablet Logo & Title */}
        <div className="absolute left-0 right-0 top-8 flex flex-col items-center lg:hidden">
          <div className="flex items-center space-x-2">
            <Image
              src="/OrangeLogo.svg"
              alt="Logo"
              width={53.2}
              height={38.97}
              priority
            />
            <span className={cn(fontTitle2, "text-brand")}>Orderific</span>
          </div>
          <h1 className={cn(fontTitle1, "mt-4 text-black-100")}>
            Service Panel
          </h1>
        </div>

        {/* Form Container */}
        <div className="w-[360px]">
          <div className="space-y-4 text-center lg:space-y-2">
            <h2 className={fontTitle1}>Welcome Back</h2>
            <p className={cn(fontBodyNormal, "text-black-60")}>
              Manage, streamline, and thrive effortlessly.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4 lg:mt-4">
            {isCodeLogin ? (
              <CodeInput
                length={6}
                value={code}
                onChange={setCode}
                labelNormal="Enter 6 digit pin"
              />
            ) : (
              <>
                <Input
                  type="email"
                  placeholder="Enter email address"
                  label="Email"
                  variant="signIn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  label="Password"
                  variant="signIn"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  endIcon={showPassword ? EyeOffIcon : EyeIcon}
                  onEndIconClick={() => setShowPassword(!showPassword)}
                />
              </>
            )}

            <div className="flex items-center justify-between">
              {!isCodeLogin && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={rememberMe}
                    onClick={() => setRememberMe(!rememberMe)}
                  />
                  <span className={fontBodyNormal}>Remember me</span>
                </div>
              )}
              <button
                type="button"
                onClick={toggleLoginMethod}
                className={cn(
                  fontBodyLinkNormal,
                  "font-bold underline underline-offset-4",
                  isCodeLogin ? "mx-auto" : ""
                )}
              >
                {isCodeLogin ? "Login with Email" : "Login with Code"}
              </button>
            </div>

            <MainButton
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isCodeLogin ? code.length !== 6 : !email || !password}
            >
              Sign In
            </MainButton>
          </form>
        </div>
      </div>
    </div>
  )
}
