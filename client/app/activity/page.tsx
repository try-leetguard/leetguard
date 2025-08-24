"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ActivityPage() {
  const [goalQuestions, setGoalQuestions] = useState(5);
  const [extensionEnabled, setExtensionEnabled] = useState(true);
  const [showUnblockDialog, setShowUnblockDialog] = useState(false);
  const [countdown, setCountdown] = useState(20);
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isMessageVisible, setIsMessageVisible] = useState(true);

  const motivationalMessages = [
    "Please wait before proceeding...",
    "Stay focused - your future self will thank you.",
    "Don't let a website steal your momentum.",
    "Small habits today create big wins tomorrow.",
  ];

  useEffect(() => {
    // Set light mode for activity page
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }, []);

  const handleGoalChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    setGoalQuestions(Math.max(0, numValue));
  };

  const handleExtensionToggle = (enabled: boolean) => {
    if (!enabled && extensionEnabled) {
      // User is trying to turn OFF the extension
      setShowUnblockDialog(true);
      setCountdown(20);
      setIsCountdownActive(true);
      setCurrentMessageIndex(0);
      setIsMessageVisible(true);
    } else {
      setExtensionEnabled(enabled);
    }
  };

  const handleProceedUnblock = () => {
    setExtensionEnabled(false);
    setShowUnblockDialog(false);
    setIsCountdownActive(false);
  };

  const handleCancelUnblock = () => {
    setShowUnblockDialog(false);
    setIsCountdownActive(false);
  };

  // Countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCountdownActive && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setIsCountdownActive(false);
    }
    return () => clearInterval(interval);
  }, [isCountdownActive, countdown]);

  // Message rotation effect
  useEffect(() => {
    let messageInterval: NodeJS.Timeout;

    if (showUnblockDialog && isCountdownActive) {
      messageInterval = setInterval(() => {
        setIsMessageVisible(false);
        setTimeout(() => {
          setCurrentMessageIndex(
            (prevIndex) => (prevIndex + 1) % motivationalMessages.length
          );
          setIsMessageVisible(true);
        }, 700); // Half of the fade transition time
      }, 2500); // 2.5 seconds per message (so each message shows twice in 20 seconds)
    } else if (countdown === 0) {
      setCurrentMessageIndex(0);
      setIsMessageVisible(true);
    }
    return () => {
      if (messageInterval) {
        clearInterval(messageInterval);
      }
    };
  }, [showUnblockDialog, isCountdownActive, motivationalMessages.length]);

  return (
    <div className="min-h-screen text-black bg-white">
      <div className="flex h-screen bg-white">
        <Sidebar activePage="activity" />

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Header */}
          <header className="h-32 border-b border-gray-200 flex items-center px-6 bg-white">
            <h1 className="text-4xl font-normal text-black">My Activity</h1>
          </header>

          {/* Content Area */}
          <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
            <div className="flex justify-start">
              <div className="w-full max-w-4xl">
                {/* Progress Tracker Column */}
                <div className="bg-white border border-gray-400 p-6 mb-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-medium text-black mb-2">
                      Today's Progress
                    </h3>
                    <p className="text-black text-sm leading-relaxed mb-4">
                      Track your daily question completion progress.
                    </p>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-black text-sm font-medium">
                          Questions Completed
                        </span>
                        <span className="text-black text-sm">
                          2 / {goalQuestions}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-green-600 h-3 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(
                              (2 / goalQuestions) * 100,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-4 -mx-6 px-6">
                    <p className="text-black text-xs">
                      Complete {goalQuestions - 2} more questions to unlock
                      websites.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Goals Column */}
                  <div className="bg-white border border-gray-400 p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-medium text-black mb-2">
                        Daily Goals
                      </h3>
                      <p className="text-black text-sm leading-relaxed mb-4">
                        Set how many questions you need to complete to unblock.
                      </p>
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          min="0"
                          value={goalQuestions}
                          onChange={(e) => handleGoalChange(e.target.value)}
                          className="w-20 border border-gray-300 px-4 py-2 text-black focus:outline-none focus:border-gray-400"
                        />
                        <span className="text-black text-sm">questions</span>
                      </div>
                    </div>
                    <div className="border-t border-gray-200 pt-4 flex justify-end -mx-6 px-6">
                      <button
                        onClick={() =>
                          console.log("Goal saved:", goalQuestions)
                        }
                        className="px-4 py-2 text-sm font-medium bg-black text-white hover:bg-gray-800 transition-colors duration-200"
                      >
                        Save Goal
                      </button>
                    </div>
                  </div>

                  {/* Extension Toggle Column */}
                  <div className="bg-white border border-gray-400 p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-medium text-black mb-2">
                        Extension Control
                      </h3>
                      <p className="text-black text-sm leading-relaxed mb-4">
                        Control whether websites are blocked or unblocked.
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <span className="text-black text-sm font-medium">
                            Block/Unblock Websites
                          </span>
                          <p className="text-black text-xs">
                            {extensionEnabled
                              ? "Extension is active"
                              : "Extension is disabled"}
                          </p>
                        </div>
                        <Switch
                          checked={extensionEnabled}
                          onCheckedChange={handleExtensionToggle}
                          className={`${
                            extensionEnabled
                              ? "data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                              : ""
                          }`}
                        />
                      </div>
                    </div>
                    <div className="border-t border-gray-200 pt-4 -mx-6 px-6">
                      <p className="text-black text-xs">
                        When enabled, websites will be blocked until you
                        complete your daily goal. To unblock, you must wait 20
                        seconds before continuing.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Unblock Confirmation Dialog */}
      <Dialog open={showUnblockDialog} onOpenChange={setShowUnblockDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-medium text-black">
              Unblock Websites
            </DialogTitle>
            <DialogDescription className="text-black text-sm leading-relaxed">
              You must wait 20 seconds before unblocking websites. This helps
              maintain your focus and productivity.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-black mb-2">
                {countdown}s
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div
                  className="bg-black h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${((20 - countdown) / 20) * 100}%` }}
                ></div>
              </div>
              <p
                className={`text-black text-sm transition-opacity duration-1000 ease-in-out ${
                  isMessageVisible ? "opacity-100" : "opacity-0"
                }`}
              >
                {isCountdownActive
                  ? motivationalMessages[currentMessageIndex]
                  : "You can now proceed to unblock websites"}
              </p>
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleCancelUnblock}
              className="border-gray-300 text-black hover:bg-gray-50"
            >
              Go Back
            </Button>
            <Button
              onClick={handleProceedUnblock}
              disabled={isCountdownActive}
              className={`${
                isCountdownActive
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-800"
              }`}
            >
              Proceed to Unblock
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
