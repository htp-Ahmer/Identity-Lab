import { motion } from "framer-motion";
import { Link } from "wouter";
import { checkers } from "@/data/checkers";

export default function Home() {
  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center pt-20 pb-16 px-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 max-w-md w-full"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
          Identity Lab
        </h1>
        <p className="text-gray-400 text-lg">
          Discover every layer of your personality — one checker at a time.
        </p>
      </motion.div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4">
        {checkers.map((checker, index) => (
          <motion.div
            key={checker.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6 h-full flex flex-col hover:border-[#3a3a3a] transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl">{checker.emoji}</span>
                <h2 className="text-2xl font-bold text-white">{checker.title}</h2>
              </div>
              <p className="text-gray-400 mb-6 flex-grow">{checker.description}</p>
              <Link href={`/quiz/${checker.id}`} className="w-full">
                <button className="w-full bg-[#1c1c1c] hover:bg-[#2c2c2c] text-white font-semibold py-4 rounded-full transition-colors flex items-center justify-center gap-2">
                  Start
                </button>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}