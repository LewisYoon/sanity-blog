import Head from "next/head";

import { useEffect, useState } from "react";
import Header from "../components/Header";
import Image from "next/image";
import L from "../public/L.png";
import LW from "../public/LW.png";
import { sanityClient, urlFor } from "../sanity";
import { Post } from "../typings.d";
import Link from "next/link";
import { useTheme } from "next-themes";
import SideBar from "../components/Sidebar";

interface Props {
  posts: [Post];
}

export default function Home({ posts }: Props) {
  const { systemTheme, theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const currentTheme = theme === "system" ? systemTheme : theme;

  useEffect(() => {
    setMounted(true);
  }, []);

  const renderClassChanger = () => {
    if (!mounted) return null;

    if (currentTheme === "dark") {
      return "flex justify-between p-5  bg-[#1f1e1e]";
    } else return "flex justify-between p-5 bg-[#f0f0f0]";
  };

  return (
    <div className="mx-auto max-w-7xl font-ubuntu">
      <Head>
        <title>Lewis's Blog</title>
        <link rel="icon" href="/L.png" />
      </Head>

      <SideBar />

      <Header />

      <div
        className=" flex justify-between items-center
      bg-yellow-400 border-y border-black py-10 lg:py-0 "
      >
        <div className="px-10 space-y-5">
          <h1 className="text-6xl text-black max-w-xl font-ubuntu ">
            <span
              className="underline 
          decoration-4 decoration-black font-bold "
            >
              Welcome!
            </span>{" "}
            Explore variety of topics here and be connected
          </h1>
          <h2 className="text-black">
            *This is a Blog app inspired by Sonny Sangha with his MEDIUM clone*
          </h2>
        </div>

        <div>
          <div className="hidden md:inline-flex object-contain  h-56 w-56  lg:h-full lg:w-full hover:animate-spin ">
            {currentTheme === "dark" ? <Image src={L} /> : <Image src={LW} />}
          </div>
        </div>
      </div>
      {/* post */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3
      md:gap-6 p-2 md:p-6"
      >
        {posts.map((post) => (
          <Link key={post._id} href={`/post/${post.slug.current}`}>
            <div className=" rounded-lg group cursor-pointer overflow-hidden">
              <img
                className="h-60 w-full object-cover group-hover:scale-105 transition-transform duration-200 ease-in-out"
                src={urlFor(post.mainImage).url()!}
                alt=""
              />

              <div className={renderClassChanger()!}>
                <div>
                  <p className="text-lg font-bold">{post.title}</p>
                  <p className="text-xs">
                    {post.description} by{" "}
                    <span className="font-bold"> {post.author.name}</span>{" "}
                  </p>
                </div>
                <img
                  className="w-12 h-12 rounded-full"
                  src={urlFor(post.author.image).url()!}
                  alt=""
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* <div className="flex justify-center py-2.5 w-40">
          <svg
            className="animate-bounce w-6 h-6 text-gray-900"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div> */

export const getServerSideProps = async () => {
  const query = `*[_type == 'post']{
    _id,
    title,
    author-> {
      name, 
      image
    },
    description,
    mainImage,
    slug
  }`;

  const posts = await sanityClient.fetch(query);

  return {
    props: {
      posts,
    },
  };
};
