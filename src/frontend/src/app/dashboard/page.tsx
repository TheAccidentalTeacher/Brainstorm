"use client";

import { useState } from "react";
import Link from "next/link";
import UserGuide from "../../components/UserGuide";

export default function Dashboard() {
  const [userName] = useState("User");
  const [recentProjects] = useState([
    { id: 1, name: "Marketing Campaign", progress: 75, color: "bg-blue-500" },
    { id: 2, name: "Product Launch", progress: 40, color: "bg-green-500" },
    { id: 3, name: "Research Project", progress: 20, color: "bg-purple-500" },
  ]);
  
  const [upcomingTasks] = useState([
    { id: 1, title: "Finalize design mockups", dueDate: "Today", priority: "high" },
    { id: 2, title: "Review marketing materials", dueDate: "Tomorrow", priority: "medium" },
    { id: 3, title: "Team meeting", dueDate: "Jul 18", priority: "medium" },
    { id: 4, title: "Prepare presentation", dueDate: "Jul 20", priority: "high" },
  ]);
  
  const [aiInsights] = useState([
    { id: 1, type: "pattern", content: "Your team completes tasks 30% faster when they're broken down into smaller subtasks." },
    { id: 2, type: "suggestion", content: "Consider scheduling brainstorming sessions in the morning based on your team's activity patterns." },
  ]);

  return (
    <div>
      <UserGuide />
      
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
        Welcome back, {userName}
      </h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Here&apos;s what&apos;s happening with your projects today.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Stats Cards */}
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Active Projects
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900 dark:text-white">
                      12
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-4 sm:px-6">
            <div className="text-sm">
              <Link href="/dashboard/projects" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                View all projects
                <span aria-hidden="true"> &rarr;</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Completed Tasks
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900 dark:text-white">
                      24
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-4 sm:px-6">
            <div className="text-sm">
              <Link href="/dashboard/tasks" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                View all tasks
                <span aria-hidden="true"> &rarr;</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Recent Notes
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900 dark:text-white">
                      8
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-4 sm:px-6">
            <div className="text-sm">
              <Link href="/dashboard/notes" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                View all notes
                <span aria-hidden="true"> &rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Projects */}
      <h2 className="mt-8 text-lg font-medium text-gray-900 dark:text-white">
        Recent Projects
      </h2>
      <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {recentProjects.map((project) => (
          <div key={project.id} className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {project.name}
                </h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                  Active
                </span>
              </div>
              <div className="mt-4">
                <div className="relative pt-1">
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

      {/* Two-column layout for tasks and insights */}
      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Upcoming Tasks */}
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
              Upcoming Tasks
            </h3>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {upcomingTasks.map((task) => (
                <li key={task.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id={`task-${task.id}`}
                        name={`task-${task.id}`}
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-700 rounded"
                      />
                      <label htmlFor={`task-${task.id}`} className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {task.title}
                      </label>
                    </div>
                    <div className="flex items-center">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        task.priority === 'high' 
                          ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100' 
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                      }`}>
                        {task.priority}
                      </span>
                      <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                        {task.dueDate}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-4 sm:px-6">
            <div className="text-sm">
              <Link href="/dashboard/tasks" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                View all tasks
                <span aria-hidden="true"> &rarr;</span>
              </Link>
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
              AI Insights
            </h3>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {aiInsights.map((insight) => (
                <li key={insight.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 ${
                      insight.type === 'pattern' 
                        ? 'text-blue-500' 
                        : 'text-green-500'
                    }`}>
                      {insight.type === 'pattern' ? (
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      ) : (
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {insight.content}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-4 sm:px-6">
            <div className="text-sm">
              <Link href="/dashboard/ai-chat" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                Chat with AI
                <span aria-hidden="true"> &rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}