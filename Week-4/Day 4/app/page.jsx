"use client";

import { useState } from "react";
import Header from "@/components/Header";
import SearchSection from "@/components/SearchSection";
import ErrorMessage from "@/components/ErrorMessage";
import ResultsGrid from "@/components/ResultsGrid";
import EmptyState from "@/components/EmptyState";
import UserProfileCard from "@/components/UserProfileCard";
import KeyStatistics from "@/components/KeyStatistics";
import RepositoryList from "@/components/RepositoryList";
import ActivityFeed from "@/components/ActivityFeed";
import { useTheme } from "next-themes";
import {
  useSearchUsersQuery,
  useGetUserQuery,
  useGetUserReposQuery,
  useGetUserEventsQuery,
} from "../store/githubApi";

export default function GitHubSearchDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const { theme, setTheme } = useTheme();

  const {
    data: searchResults,
    isLoading: searchLoading,
    error: searchError,
  } = useSearchUsersQuery(searchQuery, {
    skip: !searchQuery.trim(),
  });

  const { data: userDetails, isLoading: userLoading } = useGetUserQuery(
    selectedUser,
    {
      skip: !selectedUser,
    }
  );

  const { data: repositories, isLoading: reposLoading } = useGetUserReposQuery(
    selectedUser,
    {
      skip: !selectedUser,
    }
  );

  const { data: activities, isLoading: activitiesLoading } =
    useGetUserEventsQuery(selectedUser, {
      skip: !selectedUser,
    });

  const handleSearch = (e) => {
    e.preventDefault();
    const input = e.target.querySelector("input");
    const value = input ? input.value.trim() : "";
    if (value) {
      setSearchQuery(value);
    }
  };

  const handleUserSelect = (username) => {
    setSelectedUser(username);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const goBackToSearch = () => {
    setSelectedUser(null);
  };

  const formatActivity = (event) => {
    switch (event.type) {
      case "PushEvent":
        return `Pushed ${event.payload.commits?.length || 0} commit(s) to ${
          event.repo.name
        }`;
      case "CreateEvent":
        return `Created ${event.payload.ref_type} ${
          event.payload.ref || ""
        } in ${event.repo.name}`;
      case "WatchEvent":
        return `Starred ${event.repo.name}`;
      case "ForkEvent":
        return `Forked ${event.repo.name}`;
      case "IssuesEvent":
        return `${event.payload.action} issue in ${event.repo.name}`;
      case "PullRequestEvent":
        return `${event.payload.action} pull request in ${event.repo.name}`;
      default:
        return `${event.type.replace("Event", "")} in ${event.repo.name}`;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        selectedUser={selectedUser}
        goBackToSearch={goBackToSearch}
        toggleTheme={toggleTheme}
        theme={theme}
      />
      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {selectedUser && userDetails ? (
          // User Dashboard View
          <div className="space-y-8">
            {userLoading || reposLoading || activitiesLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">
                  Loading user details...
                </p>
              </div>
            ) : (
              <>
                <UserProfileCard
                  userDetails={userDetails}
                  formatDate={formatDate}
                />
                <KeyStatistics userDetails={userDetails} />
                <RepositoryList repositories={repositories} />
                <ActivityFeed
                  activities={activities}
                  formatActivity={formatActivity}
                  formatDate={formatDate}
                />
              </>
            )}
          </div>
        ) : (
          // Search Interface
          <>
            {/* Search Section */}
            <SearchSection
              handleSearch={handleSearch}
              loading={searchLoading}
            />

            {/* Error Message */}
            <ErrorMessage error={searchError?.message} />

            {/* Results Grid */}
            <ResultsGrid
              users={searchResults?.items}
              fetchUserDetails={handleUserSelect}
            />

            {/* Empty State */}
            {!searchLoading &&
              searchResults?.items?.length === 0 &&
              searchQuery &&
              !searchError && <EmptyState type="noResults" />}

            {/* Initial State */}
            {!searchQuery && !searchResults?.items?.length && (
              <EmptyState type="initial" />
            )}
          </>
        )}
      </main>
    </div>
  );
}
