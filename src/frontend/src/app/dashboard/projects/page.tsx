"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Project {
  id: number;
  name: string;
  description: string;
  status: string;
  progress: number;
  color: string;
  team: string;
  updatedAt: string;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  // In a real app, you would fetch this data from your API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProjects([
        {
          id: 1,
          name: "Marketing Campaign",
          description: "Q3 product marketing campaign for new features",
          status: "active",
          progress: 75,
          color: "bg-blue-500",
          team: "Marketing",
          updatedAt: "2025-07-15",
        },
        {
          id: 2,
          name: "Product Launch",
          description: "New product launch preparation and coordination",
          status: "active",
          progress: 40,
          color: "bg-green-500",
          team: "Product",
          updatedAt: "2025-07-14",
        },
        {
          id: 3,
          name: "Research Project",
          description: "Market research for upcoming product features",
          status: "active",
          progress: 20,
          color: "bg-purple-500",
          team: "Research",
          updatedAt: "2025-07-13",
        },
        {
          id: 4,
          name: "Website Redesign",
          description: "Complete overhaul of company website",
          status: "completed",
          progress: 100,
          color: "bg-gray-500",
          team: "Design",
          updatedAt: "2025-07-10",
        },
        {
          id: 5,
          name: "Customer Feedback Analysis",
          description: "Analysis of Q2 customer feedback and recommendations",
          status: "completed",
          progress: 100,
          color: "bg-gray-500",
          team: "Customer Success",
          updatedAt: "2025-07-08",
        },
        {
          id: 6,
          name: "Mobile App Development",
          description: "Development of new mobile application",
          status: "planned",
          progress: 0,
          color: "bg-yellow-500",
          team: "Engineering",
          updatedAt: "2025-07-16",
        },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter projects based on status
  const filteredProjects = projects.filter((project) => {
    if (filter === "all") return true;
    return project.status === filter;
  });

  return (
    <div>
      <div className="pb-5 border-b border-gray-200 dark:border-gray-700 sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Projects
        </h1>
        <div className="mt-3 sm:mt-0 sm:ml-4">
          <Link
            href="/dashboard/projects/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create new project
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-4">
        <div className="sm:hidden">
          <label htmlFor="status-filter" className="sr-only">
            Select a filter
          </label>
          <select
            id="status-filter"
            name="status-filter"
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="planned">Planned</option>
          </select>
        </div>
        <div className="hidden sm:block">
          <nav className="flex space-x-4" aria-label="Tabs">
            <button
              onClick={() => setFilter("all")}
              className={`${
                filter === "all"
                  ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              } px-3 py-2 font-medium text-sm rounded-md`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("active")}
              className={`${
                filter === "active"
                  ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              } px-3 py-2 font-medium text-sm rounded-md`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`${
                filter === "completed"
                  ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              } px-3 py-2 font-medium text-sm rounded-md`}
            >
              Completed
            </button>
            <button
              onClick={() => setFilter("planned")}
              className={`${
                filter === "planned"
                  ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              } px-3 py-2 font-medium text-sm rounded-md`}
            >
              Planned
            </button>
          </nav>
        </div>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="animate-pulse flex space-x-4">
                  <div className="flex-1 space-y-4 py-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-4 sm:px-6">
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <div key={project.id} className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {project.name}
                  </h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    project.status === 'active' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
                      : project.status === 'completed'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                  }`}>
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {project.description}
                </p>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="text-gray-500 dark:text-gray-400">
                      {project.team}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400">
                      Updated {project.updatedAt}
                    </div>
                  </div>
                  <div className="mt-2 relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block text-gray-600 dark:text-gray-400">
                          Progress
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-gray-600 dark:text-gray-400">
                          {project.progress}%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
                      <div
                        style={{ width: `${project.progress}%` }}
                        className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${project.color}`}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <Link href={`/dashboard/projects/${project.id}`} className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                    View project
                    <span aria-hidden="true"> &rarr;</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
          
          {/* Create new project card */}
          <div className="bg-gray-50 dark:bg-gray-700 overflow-hidden shadow rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
            <div className="px-4 py-5 sm:p-6 flex items-center justify-center h-full">
              <Link href="/dashboard/projects/new" className="text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-white">
                  Create a new project
                </span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}