"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { DM_Sans } from "next/font/google";

const dmSans = DM_Sans({ subsets: ["latin"] });

export default function ActivityPage() {
  const [timeframe, setTimeframe] = useState<"day" | "week">("day");
  const [key, setKey] = useState("day"); // Unique key for BarChart to force remount

  useEffect(() => {
    // Set light mode for activity page
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }, []);

  // Generate random data for demonstration
  const generateDayData = () => {
    const hours = [];
    for (let i = 0; i < 24; i++) {
      const hour =
        i === 0
          ? "12 AM"
          : i === 12
          ? "12 PM"
          : i > 12
          ? `${i - 12} PM`
          : `${i} AM`;
      // No bars from 2pm (14) to 6pm (18), and from 11am (11) to 9am (9)
      let focusedTime = 0;
      if (i >= 10 && i <= 22 && (i < 14 || i > 18)) {
        // 10am to 10pm, except 2pm-6pm
        focusedTime = Math.floor(Math.random() * 60) + 10;
      }
      hours.push({
        time: hour,
        focusedTime,
      });
    }
    return hours;
  };

  const generateWeekData = () => {
    const days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    return days.map((day) => {
      if (day === "Saturday" || day === "Sunday") {
        return {
          day,
          focusedTime: Math.floor(Math.random() * 140) + 10, // Random minutes between 10-150
        };
      }
      return {
        day,
        focusedTime: Math.floor(Math.random() * 240) + 60, // Random minutes between 60-300
      };
    });
  };

  const dayData = generateDayData();
  const weekData = generateWeekData();
  const currentData = timeframe === "day" ? dayData : weekData;

  // When timeframe changes, update the key to force BarChart remount
  useEffect(() => {
    setKey(timeframe + "-" + Date.now());
  }, [timeframe]);

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <div className="flex h-screen">
        <Sidebar activePage="activity" />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-32 border-b border-gray-200 flex items-center px-6 bg-white">
            <h1 className="text-4xl font-normal text-black">My Activity</h1>
          </header>

          {/* Content Area */}
          <main className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-6xl mx-auto">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card
                  className={`bg-white text-black border border-gray-400 rounded-none ${dmSans.className}`}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-black">
                      Total Focus Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-black">
                    <div className="text-2xl font-medium">12h 34m</div>
                    <p className="text-xs text-muted-foreground">
                      +2h 15m from last week
                    </p>
                  </CardContent>
                </Card>
                <Card
                  className={`bg-white text-black border border-gray-400 rounded-none ${dmSans.className}`}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-black">
                      Problems Solved
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-black">
                    <div className="text-2xl font-medium">47</div>
                    <p className="text-xs text-muted-foreground">
                      +8 from last week
                    </p>
                  </CardContent>
                </Card>
                <Card
                  className={`bg-white text-black border border-gray-400 rounded-none ${dmSans.className}`}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-black">
                      Focus Sessions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-black">
                    <div className="text-2xl font-medium">23</div>
                    <p className="text-xs text-muted-foreground">
                      +5 from last week
                    </p>
                  </CardContent>
                </Card>
              </div>
              {/* Graph Section */}
              <Card
                className={`w-full bg-white text-black border border-gray-400 rounded-none ${dmSans.className}`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold text-black">
                      Focus Time Overview
                    </CardTitle>
                    <div className="flex space-x-2">
                      <Button
                        variant={timeframe === "day" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTimeframe("day")}
                        className={
                          timeframe === "day"
                            ? "border-b-2 border-black rounded-none hover:bg-transparent hover:text-black hover:border-none pointer-events-none"
                            : "border-none rounded-none hover:bg-transparent hover:text-black hover:border-none"
                        }
                      >
                        Day
                      </Button>
                      <Button
                        variant={timeframe === "week" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTimeframe("week")}
                        className={
                          timeframe === "week"
                            ? "border-b-2 border-black rounded-none hover:bg-transparent hover:text-black hover:border-none pointer-events-none"
                            : "border-none rounded-none hover:bg-transparent hover:text-black hover:border-none"
                        }
                      >
                        Week
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="text-black">
                  <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        key={key} // This forces a remount and triggers animation
                        data={currentData}
                      >
                        <defs>
                          <pattern
                            id="crosshatch"
                            width="8"
                            height="8"
                            patternUnits="userSpaceOnUse"
                          >
                            <path d="M0 0L8 8" stroke="#000" strokeWidth="1" />
                          </pattern>
                        </defs>
                        <XAxis
                          dataKey={timeframe === "day" ? "time" : "day"}
                          stroke="#000"
                          strokeWidth={2}
                          fontSize={12}
                          tickLine={false}
                          axisLine={true}
                        />
                        <YAxis
                          stroke="#888888"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => `${value}m`}
                        />
                        <Tooltip
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-white p-3 border border-gray-200 rounded-none shadow-lg">
                                  <p className="font-medium">{label}</p>
                                  <p className="text-blue-600">
                                    {payload[0].value} minutes focused
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar
                          dataKey="focusedTime"
                          fill="url(#crosshatch)"
                          stroke="#000"
                          strokeWidth={2}
                          radius={[0, 0, 0, 0]}
                          isAnimationActive={true}
                          animationDuration={800}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
