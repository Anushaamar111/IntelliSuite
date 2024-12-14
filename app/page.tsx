import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
      {/* Welcome Text */}
      <h1 className="text-4xl font-bold mb-10 text-center m-12 p-11 text">
        Welcome to Intelli-Suite
      </h1>

      {/* Card Container */}
      <div className="flex flex-wrap justify-center gap-8 ">
        {/* Card 1 */}
        <div className="card bg-base-100 w-96 shadow-xl h-90; /* if --fallback-bc isn't set */">
          <figure>
            <img src="/images/home.webp" />
          </figure>
          <div className="card-body">
            <div className="card-actions justify-end">
              <Link href="/home">
                <button className="btn btn-primary  w-44 ml-20 mr-20">
                  Home
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="card bg-base-100 w-96 shadow-xl">
          <figure>
            <img src="/images/photo1.png" />
          </figure>
          <div className="card-body">
            <div className="card-actions justify-end">
              <Link href="/image-upload">
                <button className="btn btn-primary w-44 ml-20 mr-20">
                  Upload Image
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="card bg-base-100 w-96 shadow-xl">
          <figure>
            <img src="/images/image.png" alt="video upload" />
          </figure>
          <div className="card-body">
            <div className="card-actions justify-end">
              <Link href="/video-uplaod">
                <button className="btn btn-primary  w-44 ml-20 mr-20">
                  Upload Video
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
