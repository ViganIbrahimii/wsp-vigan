import React from "react"
import { GetActivityParams } from "@/api/activity"
import { ActiviteisSortingOption } from "@/constants/activitiesSortingOptions"

import { Activity } from "@/types/interfaces/activity.interface"
import { cn } from "@/lib/utils"
import SearchInput from "@/components/searchInput"
import { CustomSelect } from "@/components/select"
import Spinner from "@/components/spinner"
import {
  fontBodyNormal,
  fontCaptionBold,
  fontHeadline,
} from "@/styles/typography"

interface ActivitiesListProps {
  activities: Activity[]
  activitiesRef: React.RefObject<HTMLDivElement>
  activityFilters: GetActivityParams
  sortOptions: { label: string; value: ActiviteisSortingOption }[]
  isLoading: boolean
  isFetchingNextPage: boolean
  handleSortChange: (option: {
    value: ActiviteisSortingOption
    label: string
  }) => void
  updateSearch: (query: string) => void
}

export default function ActivitiesList({
  activities,
  activitiesRef,
  activityFilters,
  sortOptions,
  isLoading,
  isFetchingNextPage,
  handleSortChange,
  updateSearch,
}: ActivitiesListProps) {
  return (
    <section className="flex w-2/3 flex-col rounded-5 bg-white-60 p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className={cn(fontHeadline)}>Activities</div>
        <div className="flex items-center space-x-2">
          <CustomSelect<ActiviteisSortingOption>
            options={sortOptions}
            sortByText="Sort by:"
            menuPosition="left"
            onOptionSelect={handleSortChange}
            defaultValue={sortOptions[0]}
          />
          <SearchInput
            query={activityFilters.search || ""}
            setQuery={updateSearch}
          />
        </div>
      </div>

      <div>
        <div
          className={cn(
            fontCaptionBold,
            "flex items-center justify-between rounded-6 bg-black-5 p-4"
          )}
        >
          <div className="flex-1 text-black-60">Summary Activity</div>
          <div className="mx-6 flex-shrink-0 text-black-60">Date</div>
          <div className="mx-8 flex-shrink-0 text-black-60">Time</div>
        </div>

        <div
          ref={activitiesRef}
          className="masonry-scroll-container h-[calc(100vh-275px)] overflow-y-auto"
        >
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <Spinner />
            </div>
          ) : activities.length === 0 ? (
            <div className="flex h-full items-center justify-center text-black-60">
              No data available
            </div>
          ) : (
            <>
              {activities.map((activity, index) => (
                <React.Fragment
                  key={`${activity.date_of_activity}-${activity.time_of_activity}-${index}`}
                >
                  <div className="mb-2 flex items-center justify-between p-4 text-black-60">
                    <div className="flex-1">
                      <span className={cn(fontBodyNormal, "text-black-100")}>
                        {activity.description}
                      </span>
                    </div>
                    <div className="ml-8 flex flex-shrink-0 text-right">
                      <div className="mx-4 whitespace-nowrap">
                        {new Date(activity.date_of_activity).toLocaleDateString(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </div>
                      <div className="mx-4 whitespace-nowrap">
                        {activity.time_of_activity
                          ?.split(":")
                          .slice(0, 2)
                          .join(":") || "--:--"}
                      </div>
                    </div>
                  </div>
                  {index < activities.length - 1 && <hr />}
                </React.Fragment>
              ))}
              <div data-bottom-sentinel>
                {isFetchingNextPage && (
                  <div className="flex justify-center py-4">
                    <Spinner />
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
