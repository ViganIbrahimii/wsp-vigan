"use client"

import React, { useRef } from "react"
import Image from "next/image"
import { GetActivityParams } from "@/api/activity"
import { ActiviteisSortingOption } from "@/constants/activitiesSortingOptions"
import {
  EditIcon,
  LogoutIcon,
  MailIcon,
  PersonAddIcon,
  SettingAccountBoxIcon,
} from "@/icons"

import { cn } from "@/lib/utils"
import { IconButton } from "@/components/iconButton"
import ActivitiesList from "@/components/Profile/Activities"
import DefaultPage from "@/components/Profile/DefaultPage"
import PasswordChange from "@/components/Profile/PasswordChange"
import {
  fontBodyNormal,
  fontCaptionNormal,
  fontHeadline,
  fontTitle1,
} from "@/styles/typography"

// Mock activities data
const mockActivities = [
  {
    id: "1",
    description: "Updated profile picture",
    date_of_activity: "2024-01-05",
    time_of_activity: "18:36:00",
  },
  {
    id: "2",
    description: "Changed password",
    date_of_activity: "2024-01-05",
    time_of_activity: "18:36:00",
  },
  {
    id: "3",
    description: "Edited account details",
    date_of_activity: "2024-01-05",
    time_of_activity: "18:36:00",
  },
  {
    id: "4",
    description: "Logged in from new device",
    date_of_activity: "2024-01-05",
    time_of_activity: "18:36:00",
  },
  {
    id: "5",
    description: "Updated email address",
    date_of_activity: "2024-01-05",
    time_of_activity: "18:36:00",
  },
  {
    id: "6",
    description: "Changed default page settings",
    date_of_activity: "2024-01-05",
    time_of_activity: "18:36:00",
  },
  {
    id: "7",
    description: "Updated notification preferences",
    date_of_activity: "2024-01-05",
    time_of_activity: "18:36:00",
  },
  {
    id: "8",
    description: "Added new payment method",
    date_of_activity: "2024-01-05",
    time_of_activity: "18:36:00",
  },
  {
    id: "9",
    description: "Removed payment method",
    date_of_activity: "2024-01-05",
    time_of_activity: "18:36:00",
  },
  {
    id: "10",
    description: "Updated shipping address",
    date_of_activity: "2024-01-05",
    time_of_activity: "18:36:00",
  },
  {
    id: "11",
    description: "Changed account username",
    date_of_activity: "2024-01-05",
    time_of_activity: "18:36:00",
  },
  {
    id: "12",
    description: "Updated profile information",
    date_of_activity: "2024-01-05",
    time_of_activity: "18:36:00",
  },
  {
    id: "13",
    description: "Enabled two-factor authentication",
    date_of_activity: "2024-01-05",
    time_of_activity: "18:36:00",
  },
  {
    id: "14",
    description: "Disabled two-factor authentication",
    date_of_activity: "2024-01-05",
    time_of_activity: "18:36:00",
  },
  {
    id: "15",
    description: "Linked social media account",
    date_of_activity: "2024-01-05",
    time_of_activity: "18:36:00",
  },
]

// Sort options for activities
const sortOptions = [
  { label: "Newest First", value: ActiviteisSortingOption.NEWEST_FIRST },
  { label: "Oldest First", value: ActiviteisSortingOption.OLDEST_FIRST },
]

const Profile = () => {
  const activitiesRef = useRef<HTMLDivElement>(null)

  // Mock activity filters
  const activityFilters: GetActivityParams = {
    user_id: "123",
    page_limit: 1,
    page_size: 10,
    sort_by: "created_at",
    sort_order: "desc",
    search: "",
  }

  // Mock functions for the activities list
  const handleSortChange = (option: {
    value: ActiviteisSortingOption
    label: string
  }) => {
    console.log("Sort changed:", option)
  }

  const updateSearch = (query: string) => {
    console.log("Search query:", query)
  }

  const handleEditClick = () => {
    console.log("Edit profile clicked")
  }

  const logout = () => {
    console.log("Logout clicked")
  }

  return (
    <div className="flex min-h-screen flex-col bg-transparent">
      {/* Header Section */}
      <header className="min-h-fit w-full px-4 pt-7">
        <div className="flex items-center justify-between">
          <h1 className={cn(fontTitle1, "text-black-100")}>Profile</h1>
          <div className="flex gap-2">
            <IconButton
              icon={EditIcon}
              iconSize="24"
              size="large"
              variant="transparent"
              text="Edit Profile"
              onClick={handleEditClick}
            />
            <IconButton
              icon={LogoutIcon}
              iconSize="24"
              size="large"
              variant="transparent"
              onClick={logout}
            />
          </div>
        </div>
      </header>

      {/* Profile Information Section */}
      <section className="mt-6 w-full px-4">
        <div className="grid grid-cols-6 gap-4 lg:grid-cols-12">
          {/* Profile Image & Name */}
          <div className=" col-span-3 rounded-3 bg-black-5 p-4 lg:col-span-4">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-full">
                <Image
                  src="/profile_pic.png"
                  alt="Profile Picture"
                  fill
                  className="object-cover"
                />
              </div>
              <h2 className={cn(fontHeadline, "text-black-100")}>John Doe</h2>
            </div>
          </div>

          {/* Email Information */}
          <div className="col-span-3 rounded-3 bg-black-5 p-4 lg:col-span-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <MailIcon className="text-black-60" />
                <span className={cn(fontCaptionNormal, "text-black-60")}>
                  Email
                </span>
              </div>
              <span className={cn(fontBodyNormal, "text-black-100")}>
                john.doe@example.com
              </span>
            </div>
          </div>

          {/* Join Date */}
          <div className="col-span-3 rounded-3 bg-black-5 p-4 lg:col-span-2">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <PersonAddIcon />
                <span className={cn(fontCaptionNormal, "text-black-60")}>
                  Join at
                </span>
              </div>
              <span className={cn(fontBodyNormal, "text-black-100")}>
                Mon, 17 Jun 2023
              </span>
            </div>
          </div>

          {/* User Role */}
          <div className="col-span-3 rounded-3 bg-black-5 p-4 lg:col-span-2">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <SettingAccountBoxIcon />
                <span className={cn(fontCaptionNormal, "text-black-60")}>
                  Role
                </span>
              </div>
              <span className={cn(fontBodyNormal, "text-black-100")}>
                Administrator
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Activities and Account Settings Section */}
      <section className="mt-6 flex w-full gap-4 px-4 pb-6">
        {/* Activities List */}
        <ActivitiesList
          activities={mockActivities}
          activitiesRef={activitiesRef}
          activityFilters={activityFilters}
          sortOptions={sortOptions}
          isLoading={false}
          isFetchingNextPage={false}
          handleSortChange={handleSortChange}
          updateSearch={updateSearch}
        />

        {/* Account Settings */}
        <div className="flex w-1/3 flex-col gap-4">
          <DefaultPage />
          <PasswordChange />
        </div>
      </section>
    </div>
  )
}

export default Profile
