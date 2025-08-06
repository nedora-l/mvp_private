"use client";

import { useLottie } from "lottie-react";
import aiData from "./ai.icon.animation.json";

const AiDynamicIcon = () => {
    const defaultOptions = {
    animationData: aiData,
    loop: true,
  };

  const { View } = useLottie(defaultOptions);

  return (
    <>
      <div className="">
        <div className="w-full">{View}</div>
      </div>
    </>
  );
};

export default AiDynamicIcon;
