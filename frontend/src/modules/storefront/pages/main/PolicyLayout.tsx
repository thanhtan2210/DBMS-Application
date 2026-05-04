import React from "react";
import { Link } from "react-router-dom";

export function PolicyLayout({
  title,
  lastUpdated,
  children,
  noProse = false,
  showContact = true,
}: {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
  noProse?: boolean;
  showContact?: boolean;
}) {
  return (
    <div className="bg-[#f4f6f8] min-h-screen py-16 px-4">
      <div className="max-w-[900px] mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-[42px] font-bold text-[#112d4e] leading-tight mb-1">
            {title}
          </h1>
          <p className="text-[#6b7e8f] text-[14px]">
            Last updated: {lastUpdated}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-[12px] border border-[#e4eaf0] shadow-sm overflow-hidden">
          <div
            className={
              noProse
                ? ""
                : [
                    "p-10 lg:p-14",
                    "prose prose-slate max-w-none",
                    "prose-h2:text-[24px] prose-h2:font-bold prose-h2:text-[#112d4e] prose-h2:mb-4 prose-h2:mt-10 first:prose-h2:mt-0",
                    "prose-p:text-[#4a5e6d] prose-p:text-[15px] prose-p:leading-[1.8] prose-p:mb-5",
                    "prose-strong:text-[#112d4e] prose-strong:font-semibold",
                    "prose-li:text-[#4a5e6d] prose-li:text-[15px] prose-li:leading-[1.8] prose-li:mb-2",
                    "prose-ul:mb-6 prose-ul:mt-3",
                  ].join(" ")
            }
          >
            {children}
          </div>

          {showContact && (
            <div className="border-t border-[#e4eaf0] bg-[#f8fafc] px-10 lg:px-14 py-10">
              <h4 className="font-bold text-[20px] mb-2 text-[#112d4e]">
                Contact Us
              </h4>
              <p className="text-[#6b7e8f] text-[14px] mb-6 leading-relaxed max-w-md">
                If you have any questions about our policies, please contact our
                legal team.
              </p>
              <Link
                to="/support"
                className="inline-flex items-center gap-2 bg-[#112d4e] text-white px-7 py-3 rounded-lg font-semibold text-[14px] hover:bg-[#1a3f6f] transition-colors"
              >
                Contact Legal
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}