"use client";

import Image from "next/image";
import type { Job } from "@/store/job-store";
import { useJobStore } from "@/store/job-store";

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  const addFilter = useJobStore((state) => state.addFilter);
  const filters = useJobStore((state) => state.filters);

  const allTags = [job.role, job.level, ...job.languages, ...job.tools];

  const handleTagClick = (tag: string) => {
    if (!filters.includes(tag)) {
      addFilter(tag);
    }
  };

  return (
    <div className="bg-white rounded-md shadow-lg p-6 mb-6 relative transition-all duration-100 ease-in-out hover:border-l-4 border-teal-500">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4 md:mb-0">
          <div className="rounded-full bg-gray-100 md:flex items-center justify-center text-white font-bold text-sm overflow-hidden">
            {/* Render company logo from job.logo (public path like /photosnap.svg) */}
            <Image
              src={job.logo}
              alt={`${job.company} logo`}
              width={64}
              height={64}
              className="object-contain"
            />
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-teal-600 font-semibold text-sm">
                {job.company}
              </span>
              {job.new && (
                <span className="bg-teal-500 text-white px-2 py-1 rounded-full text-[9px] md:text-xs font-bold uppercase">
                  NEW!
                </span>
              )}
              {job.featured && (
                <span className="bg-gray-800 text-white px-2 py-1 rounded-full text-[9px] md:text-xs font-bold uppercase">
                  FEATURED
                </span>
              )}
            </div>
            <h3 className="text-gray-800 font-bold text-lg mb-2 hover:text-teal-600 transition-colors duration-150 cursor-pointer">
              {job.position}
            </h3>
            <div className="flex flex-wrap items-center gap-3 text-gray-500 text-sm font-semibold">
              <span>{job.postedAt}</span>
              <span>•</span>
              <span>{job.contract}</span>
              <span>•</span>
              <span>{job.location}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-4 md:pt-0 border-t md:border-t-0 border-gray-200">
          {allTags.map((tag, index) => (
            <button
              key={index}
              onClick={() => handleTagClick(tag)}
              className="bg-teal-50 text-teal-600 px-3 py-1 rounded font-medium text-sm hover:bg-teal-600 hover:text-white transition-colors cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
