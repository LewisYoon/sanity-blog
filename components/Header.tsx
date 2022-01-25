import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useTheme } from "next-themes";
import lightLogo from "../public/lightLogo.png";
import darkLogo from "../public/darkLogo.png";
import { MoonIcon, SunIcon } from "@heroicons/react/solid";

function Header() {
  const { systemTheme, theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const currentTheme = theme === "system" ? systemTheme : theme;

  useEffect(() => {
    setMounted(true);
  }, []);

  const renderThemeChanger = () => {
    if (!mounted) return null;

    if (currentTheme === "dark") {
      return (
        <SunIcon
          className="w-7 h-7 text-orange-200"
          role="button"
          onClick={() => setTheme("light")}
        />
      );
    } else {
      return (
        <MoonIcon
          className="w-7 h-7 text-yellow-400"
          role="button"
          onClick={() => setTheme("dark")}
        />
      );
    }
  };

  const renderColorChanger = () => {
    if (!mounted) return null;

    if (currentTheme === "dark") {
      return "text-white bg-pink-400 px-4 py-1 rounded-full";
    } else {
      return "text-white bg-green-400 px-4 py-1 rounded-full";
    }
  };

  return (
    <header className="flex justify-between p-5 font-ubuntu">
      <div className="flex items-center space-x-8">
        <Link href="/">
          <div className="w-44 md:w-56 ml-2 object-contain cursor-pointer">
            {currentTheme === "dark" ? (
              <Image src={darkLogo} />
            ) : (
              <Image src={lightLogo} />
            )}
          </div>
        </Link>
        <div
          className="hidden md:inline-flex
      items-center space-x-6"
        >
          <h3>About</h3>
          <h3>Contact</h3>
          <h3 className={renderColorChanger()!}>Follow</h3>
        </div>
      </div>

      <div
        className="flex items-center space-x-4
      "
      >
        <h3>Sign In</h3>
        <h3 className="hidden border md:inline-block px-4 py-1 rounded-full ">
          Get Started
        </h3>
        <h3>{renderThemeChanger()}</h3>
      </div>
    </header>
  );
}

export default Header;
