import { sanityClient, urlFor } from "../../sanity";
import Header from "../../components/Header";
import { Post } from "../../typings";
import { GetStaticProps } from "next";
import { createPortableTextComponent } from "next-sanity";
import PortableText from "react-portable-text";
import Sidebar from "../../components/Sidebar";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";

interface Input {
  _id: string;
  name: string;
  email: string;
  comment: string;
}

interface Props {
  post: Post;
}

function Post({ post }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Input>();

  const onSubmit: SubmitHandler<Input> = async (data) => {
    fetch("/api/createComment", {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then(() => {
        console.log(data);
        setSubmitted(true);
      })
      .catch((err) => {
        console.log(err);
        setSubmitted(false);
      });
  };
  return (
    <main className="max-w-7xl mx-auto">
      <Header />
      <Sidebar />
      <img
        className="mx-auto w-full h-40 object-cover hover:h-[300px] md:hover:h-[300px] lg:hover:h-[400px]    transition-all duration-500 ease-in-out"
        //   lg:hover:w-[800px] md:hover:w-[600px]
        src={urlFor(post.mainImage).url()!}
        alt=""
      />

      <article className="max-w-3xl mx-auto font-ubuntu">
        <h1 className="text-3xl mt-10 mb-3">{post.title}</h1>
        <h2 className="text-sm font-extralight mb-2">{post.description}</h2>

        <div className="flex space-x-5 items-center">
          <img
            src={urlFor(post.author.image).url()!}
            alt=""
            className="w-10 h-10 rounded-full"
          />
          <p className="text-sm font-extralight">
            Blog post by{" "}
            <span className="text-blue-600">{post.author.name}</span> -
            Published at {new Date(post._createdAt).toLocaleString()}
          </p>
        </div>

        {post.body && (
          <div className="mt-10">
            <PortableText
              className=""
              dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
              projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
              content={post.body}
              serializers={{
                h1: (props: any) => (
                  <h1 className="text-2xl font-bold my-5" {...props} />
                ),
                h2: (props: any) => (
                  <h1 className="text-xl font-bold my-5" {...props} />
                ),
                li: ({ children }: any) => (
                  <li className="ml-4 list-disc">{children}</li>
                ),
                link: ({ href, children }: any) => (
                  <a href={href} className="text-blue-500 hover:underline">
                    {children}
                  </a>
                ),
              }}
            />
          </div>
        )}
        {!post.body && (
          <div className="mx-auto font-bold text-4xl items-center mt-20">
            No content here
          </div>
        )}
      </article>

      <hr className="max-w-lg my-5 mx-auto border bg-yellow-500" />
      {submitted ? (
        <div className="flex flex-col py-10 my-10 bg-green-400 max-w-3xl mx-auto font-ubuntu text-black">
          <h3 className="text-3xl font-bold mx-auto">
            Thank you for submitting your comment!
          </h3>
          <p className="mx-auto">
            Once it has been approved, it will appear below!
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col p-5 max-w-2xl mx-auto mb-10 "
        >
          <h3 className="text-sm text-yellow-400">Enjoyed this article?</h3>
          <h4 className="text-3xl font-bold">Leave a comment below!</h4>
          <hr className="py-3 mt-2" />

          <input
            {...register("_id")}
            type="hidden"
            name="_id"
            value={post._id}
          />
          <label className="block mb-5">
            <span>Name</span>
            <input
              {...register("name", { required: true })}
              className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-400 outline-none focus:ring"
              placeholder="John Doe"
              type="text"
            />
          </label>
          <label className="block mb-5">
            <span>Email</span>
            <input
              {...register("email", { required: true })}
              className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-400 outline-none focus:ring"
              placeholder="johndoe@email.com"
              type="email"
            />
          </label>
          <label className="block mb-5">
            <span>Comment</span>
            <textarea
              {...register("comment", { required: true })}
              className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-400
            outline-none focus:ring"
              placeholder="Awesome!"
              rows={8}
            />
          </label>
          {/* errors will return when field validation fails */}
          <div className="flex flex-col p-5">
            {errors.name && (
              <span className="text-red-500">- The Name field is required</span>
            )}
            {errors.comment && (
              <span className="text-red-500">
                - The Comment field is required
              </span>
            )}
            {errors.email && (
              <span className="text-red-500">
                - The Email field is required
              </span>
            )}
          </div>
          <input
            className="shadow bg-green-400 hover:bg-green-200 text-black
              focus:shadow-outline focus:outline-none font-bold py-2 px-4 rounded-sm
            cursor-pointer  "
            type="submit"
            name=""
            id=""
          />
        </form>
      )}
      {/* comment */}
      <div
        className="flex flex-col p-10 my-10 max-w-2xl mx-auto
        shadow-green-400 rounded-sm shadow space-y-2
          "
      >
        <h3 className="text-4xl">Comments</h3>
        <hr className="pb-2" />

        {post.comments.map((comment) => (
          <div key={comment._id} className="">
            <p className="">
              <span className="text-blue-500">{comment.name}:</span>
              {comment.comment}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Post;

export const getStaticPaths = async () => {
  const query = `*[_type == "post"]{
        _id,
        slug{
            current
        }
    }`;
  const posts = await sanityClient.fetch(query);

  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type == 'post'&& slug.current == $slug][0]{
  _id,
 _createdAt,
  title,
  author -> {
  name,
  image
},
'comments': *[
    _type == 'comment' && 
    post._ref == ^._id &&
    approved == true],
    description,
    mainImage,
    slug,
    body

    }`;

  const post = await sanityClient.fetch(query, { slug: params?.slug });

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
    },
    revalidate: 60, //it will update the old cache every 10 mins
  };
};
