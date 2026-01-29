import { Sparkles, Users, Rocket, ArrowRight } from "lucide-react";
import { motion, type Variants } from "framer-motion";

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeInOut",
    },
  },
};

const steps = [
  {
    number: "01",
    icon: Sparkles,
    title: "Post or Browse Ideas",
    description:
      "Entrepreneurs post startup concepts with detailed requirements. Developers explore opportunities that align with their expertise and interests.",
  },
  {
    number: "02",
    icon: Users,
    title: "Collaborate & Contract",
    description:
      "Connect through our platform, discuss project scope, and generate legally binding agreements with transparent equity terms.",
  },
  {
    number: "03",
    icon: Rocket,
    title: "Build & Earn",
    description:
      "Track development progress, complete milestones, and accumulate equity ownership as you bring the vision to life.",
  },
];



export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="relative py-16 md:py-28 bg-gradient-to-b from-white to-gray-50 overflow-hidden"
    >
      {/* subtle background blur */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-200/20 rounded-full blur-[120px]" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 md:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-black mb-4">
            How It Works
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            A transparent, secure process designed to protect both entrepreneurs
            and developers
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6 md:gap-8"
        >
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div key={index} variants={item} className="relative">
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 200, damping: 18 }}
                  className="group bg-white border border-gray-200 rounded-2xl p-7 md:p-8 h-full shadow-sm hover:shadow-xl"
                >
                  {/* Number */}
                  <div className="relative mb-6 flex justify-center">
                    <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center text-white text-lg font-bold">
                      {step.number}
                    </div>

                    
                  </div>

                  {/* Icon */}
                  <div className="w-12 h-12 mx-auto mb-5 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-black transition-colors">
                    <Icon className="w-6 h-6 text-black group-hover:text-white transition-colors" />
                  </div>

                  {/* Text */}
                  <h3 className="text-lg md:text-xl font-bold text-black text-center mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-center text-sm leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-14 md:mt-20 text-center"
        >
          <p className="text-gray-600 mb-6 text-base md:text-lg">
            Ready to start your journey?
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => (window.location.href = "/entrepreneur-signup")}
              className="px-8 py-3 bg-black text-white rounded-lg font-semibold"
            >
              Post Your Idea →
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => (window.location.href = "/developer-signup")}
              className="px-8 py-3 bg-white text-black border border-gray-300 rounded-lg font-semibold"
            >
              Browse Opportunities
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
