import { useState, useEffect } from "react";
import { ArrowRight, Code, Lightbulb, Check } from "lucide-react";

export default function IndexHero() {
  return (
    <section className="relative pt-32 md:pt-40 lg:pt-48 pb-20 md:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-slate-50 to-white">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to right, #0EA5E9 1px, transparent 1px),
                           linear-gradient(to bottom, #0EA5E9 1px, transparent 1px)`,
            backgroundSize: "4rem 4rem",
          }}
        ></div>
      </div>

      {/* Floating Gradient Orbs */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-cyan-400/5 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight">
              Where Entrepreneurs & Developers Build Startups Together
            </h1>

            <p className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed max-w-2xl">
              Match, contract, and build — equity-first collaborations with
              clear roles and legal protection.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button
                onClick={() => (window.location.href = "/entrepreneur-signup")}
                className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold text-lg group inline-flex items-center justify-center gap-2"
              >
                Apply as Founder
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => (window.location.href = "/developer-signup")}
                className="px-8 py-4 bg-white text-slate-700 border-2 border-slate-300 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all font-semibold text-lg"
              >
                Join as Developer
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-500" />
                <span>No upfront fees</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-500" />
                <span>Equity-first</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-500" />
                <span>Contracts included</span>
              </div>
            </div>
          </div>

          {/* Right Content - Illustration Placeholder */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-full max-w-lg">
              {/* Collaboration Illustration */}
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
                <div className="space-y-6">
                  {/* Header */}
                  <div className="text-center pb-4 border-b border-slate-200">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      Collaboration Illustration
                    </h3>
                    <p className="text-sm text-slate-500">
                      Equity-based partnership
                    </p>
                  </div>

                  {/* Two Circles Connected */}
                  <div className="flex items-center justify-center gap-8">
                    {/* Entrepreneur Circle */}
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center shadow-lg mb-3">
                        <Lightbulb className="w-12 h-12 text-white" />
                      </div>
                      <span className="text-sm font-semibold text-slate-700">
                        Entrepreneur
                      </span>
                      <span className="text-xs text-slate-500">
                        Idea & Vision
                      </span>
                    </div>

                    {/* Connection Line */}
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-1 bg-gradient-to-r from-blue-600 to-violet-600 rounded-full mb-2"></div>
                      <span className="text-xs font-medium text-slate-600">
                        Equity Split
                      </span>
                    </div>

                    {/* Developer Circle */}
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-24 bg-gradient-to-br from-violet-600 to-purple-500 rounded-full flex items-center justify-center shadow-lg mb-3">
                        <Code className="w-12 h-12 text-white" />
                      </div>
                      <span className="text-sm font-semibold text-slate-700">
                        Developer
                      </span>
                      <span className="text-xs text-slate-500">
                        Skills & Build
                      </span>
                    </div>
                  </div>

                  {/* Bottom Stats */}
                  {/* Bottom Stats */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600 py-2 ">
                        Founder Equity
                      </div>
                      <div className="text-xs text-slate-500"> </div>
                    </div>

                    <div className="text-center">
                      <div className="text-lg font-bold text-emerald-600">
                        Legal
                      </div>
                      <div className="text-xs text-slate-500">
                        Smart Contract
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-lg font-bold text-violet-600">
                        Developer Equity
                      </div>
                      <div className="text-xs text-slate-500"> </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-100 rounded-full blur-2xl opacity-60"></div>
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-violet-100 rounded-full blur-2xl opacity-60"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
