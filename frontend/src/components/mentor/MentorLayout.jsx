import React from "react";
import { Outlet } from "react-router-dom";
import MentorSidebar from "./MentorSidebar";

export default function MentorLayout() {
  return (
    <div className="min-h-screen flex bg-slate-50">
      <MentorSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
