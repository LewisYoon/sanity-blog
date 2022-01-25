import { useTheme } from "next-themes";

import {
  MoonIcon,
  SunIcon,
  HomeIcon,
  PhoneIcon,
  InformationCircleIcon,
} from "@heroicons/react/solid";
import { useEffect, useState } from "react";

import LL from "../public/LL.png";
import { Image } from "next/image";

const SideBar = () => {
  const { systemTheme, theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const currentTheme = theme === "system" ? systemTheme : theme;

  useEffect(() => {
    setMounted(true);
  }, []);

  const Gray = () => {
    if (!mounted) return null;
    if (currentTheme === "dark") {
      return "bg-gray-700 hover:bg-pink-400";
    } else {
      return "bg-gray-900";
    }
  };
  const Text = () => {
    if (!mounted) return null;
    if (currentTheme === "dark") {
      return "Light Mode";
    } else {
      return "Dark Mode";
    }
  };

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

  const sideBarColor = () => {
    if (!mounted) return null;

    if (currentTheme === "dark") {
      return "hidden fixed top-0 left-0 h-screen w-[70px] m-0 2xl:flex flex-col text-white shadow-lg bg-gray-800";
    } else {
      return "hidden fixed top-0 left-0 h-screen w-[70px] m-0 2xl:flex flex-col text-white shadow-lg bg-gray-200";
    }
  };

  const SideBarIcon = ({ icon, text }) => (
    <div className={`sidebar-icon group ${Gray()}`}>
      {icon}
      <span className="sidebar-tooltip group-hover:scale-100">{text}</span>
    </div>
  );

  return (
    <div className={sideBarColor()}>
      <SideBarIcon
        icon={
          <HomeIcon
            onClick={() => (window.location = "/")}
            className="w-7 h-7"
          />
        }
        text="Home"
      />

      <SideBarIcon icon={renderThemeChanger()} text={Text()} />
      <SideBarIcon
        icon={<InformationCircleIcon className="w-7 h-7" />}
        text="About"
      />
      <SideBarIcon
        href="/"
        icon={<PhoneIcon className="w-7 h-7" />}
        text="Contact"
      />
    </div>
  );
};

export default SideBar;
