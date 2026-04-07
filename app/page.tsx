"use client";

import { useCallback, useMemo, useState } from "react";
import localFont from "next/font/local";

import { AnimatePresence, motion } from "framer-motion";
import ScrambleText from "@/app/components/ScrambleText";

const nostrutaru = localFont({
  src: "../public/fonts/Nosutaru-dotMPlusH-10-Regular.ttf",
  display: "swap",
});

type Phase = "intro" | "scrambling" | "reveal";

export default function Home() {
  const [phase, setPhase] = useState<Phase>("intro");

  const engchars = useMemo(
    () => [
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",
    ],
    [],
  );
  const jpchars = useMemo(
    () => [
      "あ",
      "い",
      "う",
      "え",
      "お",
      "か",
      "き",
      "く",
      "け",
      "こ",
      "さ",
      "し",
      "す",
      "せ",
      "そ",
      "た",
      "ち",
      "つ",
      "て",
      "と",
      "な",
      "に",
      "ぬ",
      "ね",
      "の",
      "は",
      "ひ",
      "ふ",
      "へ",
      "ほ",
      "ま",
      "み",
      "む",
      "め",
      "も",
      "や",
      "ゆ",
      "よ",
      "ら",
      "り",
      "る",
      "れ",
      "ろ",
      "わ",
      "を",
      "ん",
      "ア",
      "イ",
      "ウ",
      "エ",
      "オ",
      "カ",
      "キ",
      "ク",
      "ケ",
      "コ",
      "サ",
      "シ",
      "ス",
      "セ",
      "ソ",
      "タ",
      "チ",
      "ツ",
      "テ",
      "ト",
      "ナ",
      "ニ",
      "ヌ",
      "ネ",
      "ノ",
      "ハ",
      "ヒ",
      "フ",
      "ヘ",
      "ホ",
      "マ",
      "ミ",
      "ム",
      "メ",
      "モ",
      "ヤ",
      "ユ",
      "ヨ",
      "ラ",
      "リ",
      "ル",
      "レ",
      "ロ",
      "ワ",
      "ヲ",
      "ン",
    ],
    [],
  );

  const handleDone = useCallback(() => {
    setPhase("reveal");
    console.log("doneea");
  }, []);

  return (
    <div
      className={`relative min-h-screen bg-black overflow-hidden ${nostrutaru.className}`}
    >
      <motion.div
        className="absolute inset-0 bg-black pointer-events-none"
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === "intro" ? 1 : 0 }}
        transition={{ duration: 2.5 }}
        onAnimationComplete={() => {
          if (phase === "intro") setPhase("scrambling");
        }}
      />
      <div className="relative min-h-screen flex flex-col">
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-2 items-center justify-center"
          initial={{ opacity: 0, y: 0 }}
          animate={{
            opacity: 1,
            y: phase === "reveal" ? "calc(-50vh + 5rem)" : 0,
          }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <ScrambleText
            text="welcome home"
            chars={engchars}
            timeOffset={60}
            autoPlay={phase !== "intro"}
            onDone={handleDone}
            className="text-4xl text-white"
          />
          <ScrambleText
            text="お帰りなさい"
            chars={jpchars}
            timeOffset={110}
            className="text-2xl text-[#646464]"
          />
        </motion.div>
        <motion.div
          className="w-screen h-screen pb-12 flex flex-col items-center justify-center gap-4"
          transition={{ duration: 0.8, delay: 0.3 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === "reveal" ? 1 : 0 }}
          exit={{ opacity: 0 }}
        >
          <div className="text-white/70">More text here</div>
        </motion.div>
      </div>
    </div>
  );
}
