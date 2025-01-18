import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex justify-center">
      <div className="p-6 bg-white rounded shadow-md">
        <SignIn />
      </div>
    </div>
  );
}
