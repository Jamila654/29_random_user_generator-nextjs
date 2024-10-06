"use client";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { MdOutlineEmail } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import { MdLocalPhone } from "react-icons/md";
import { CgProfile } from "react-icons/cg";

export default function Home() {
  interface User {
    name: {
      first: string;
      last: string;
    };
    location: {
      street: {
        number: number;
        name: string;
      };
      city: string;
      state: string;
      country: string;
      postcode: number;
    };
    email: string;
    phone: string;
    picture: {
      medium: string;
    };
  }

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const [animatedText, setAnimatedText] = useState<string>("");
  const text = "Hi, my name is";

  useEffect(() => {
    let index = 0;
    let isErasing = false;

    const animateText = () => {
      if (!isErasing && index <= text.length) {
        setAnimatedText(text.slice(0, index));
        index++;
        if (index > text.length) {
          isErasing = true;
          setTimeout(animateText, 1000); // Wait before starting to erase
          return;
        }
      } else if (isErasing && index >= 0) {
        setAnimatedText(text.slice(0, index));
        index--;
        if (index < 0) {
          isErasing = false;
          index = 0;
        }
      }

      setTimeout(animateText, isErasing ? 100 : 150);
    };

    animateText();
  }, []);

  const handleFetchUser = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("https://randomuser.me/api/");
      if (!res.ok) {
        throw new Error("Error fetching user");
      }
      const data = await res.json();
      setUser(data.results[0]);
    } catch (error) {
      setError("Error fetching user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-950 p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Card className="bg-slate-300">
        <CardHeader className="text-center">
          <CardTitle>Random User Generator</CardTitle>
          <CardDescription>
            Click the button below to fetch a random user profile.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            className="w-full bg-yellow-700 text-white hover:bg-yellow-600 rounded-xl"
            onClick={handleFetchUser}
            disabled={loading}
          >
            {loading ? "Fetching..." : "Fetch New User"}
          </Button>
        </CardContent>
        <CardFooter>
          {error && (
            <div className="error w-full text-red-700 font-bold text-center">
              {error}
            </div>
          )}
          {user && (
            <div className="w-full text-center mt-4">
              <Image
                src={user.picture.medium}
                alt="Profile Picture"
                width={300}
                height={300}
                className="rounded-full mx-auto border-[8px]"
              />
              <div className="name w-full flex flex-col items-center justify-center mt-4">
                <h1 className="text-yellow-700 text-xl">{animatedText}</h1>
                <div className="profile w-full flex items-center justify-center gap-2">
                  <CgProfile />
                  <p className="font-bold">
                    {user.name.first} {user.name.last}
                  </p>
                </div>
              </div>
              <div className="email w-full flex items-center justify-center gap-2">
                <MdOutlineEmail />
                <p>{user.email}</p>
              </div>
              <div className="location w-full flex items-center justify-center md:gap-2 text-balance">
                <IoLocationOutline className="size-7 md:size-5" />
                <p className="text-wrap">
                  {user.location.street.number} {user.location.street.name},{" "}
                  {user.location.city}, {user.location.state},{" "}
                  {user.location.country}, {user.location.postcode}
                </p>
              </div>
              <div className="contact w-full flex items-center justify-center gap-2">
                <MdLocalPhone />
                <p>{user.phone}</p>
              </div>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

