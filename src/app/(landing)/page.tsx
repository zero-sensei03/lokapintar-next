import { Button, Spinner } from "@heroui/react";
import { Camera } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Camera />
      <Button>Press me</Button>
            <Spinner />
    </div>
  );
}
