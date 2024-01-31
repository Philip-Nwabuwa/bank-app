import { useAuthStore } from "@/store/useAuthStore";
import { CreditCard } from "lucide-react";
import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";

const AuthLayout = () => {
  const testimonials = [
    {
      author: "Eduardo G",
      quote:
        "As someone who values security above all else, I'm thoroughly impressed with the biometric login and transaction encryption this app offers. I feel confident that my personal and financial information is protected. The app's design is sleek, and the performance is flawless, even during heavy use.",
    },
    {
      author: "Samantha R",
      quote:
        "As a busy mom, I'm always on the go, and this bank app has been a lifesaver. I can deposit checks, transfer funds, and monitor my accounts with just a few taps. The user interface is so intuitive that even my kids could use it! It's secure, reliable, and has made managing my finances a breeze.",
    },
    {
      author: "Michael T",
      quote:
        "I've used several banking apps over the years, but this one stands out for its exceptional customer service. Whenever I have a question or encounter an issue, the support team is quick to respond and resolve my concerns. Plus, the app's budgeting tools have helped me get a better handle on my spending.",
    },
    {
      author: "Priya K",
      quote:
        "I travel frequently for work and need to manage my finances on the move. This bank app's real-time notifications and easy international transaction features have been incredibly helpful. It's reassuring to know that I can always check my account balances and pay bills no matter where I am in the world.",
    },
    {
      author: "Lisa D",
      quote:
        "I was new to online banking and a bit hesitant at first, but this app made the transition seamless. The tutorials and FAQs covered all my questions, making it easy to navigate through the features. Now I can't imagine going back to the old way of banking. The convenience of scheduling payments and the personalized alerts have helped me avoid late fees and keep my finances in check.",
    },
  ];

  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTestimonialIndex((prevIndex) => {
        const randomIndex = Math.floor(Math.random() * testimonials.length);
        return randomIndex !== prevIndex
          ? randomIndex
          : (randomIndex + 1) % testimonials.length;
      });
    }, 8000);

    return () => clearInterval(intervalId);
  }, []);

  const currentTestimonial = testimonials[currentTestimonialIndex];
  return (
    <>
      <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
          <div className="absolute inset-0 bg-zinc-800" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <CreditCard className="w-10 h-10 text-accent pr-2" />
            FundFirst
          </div>
          <div className="relative z-20 mt-auto bg-gradient-to-br from-zinc-600 to-zinc-800 rounded-lg p-4">
            <blockquote key={currentTestimonialIndex} className="space-y-2">
              <p className="text-lg">
                &ldquo;{currentTestimonial.quote}&rdquo;
              </p>
              <footer className="text-sm">
                <cite className="font-medium">{currentTestimonial.author}</cite>
              </footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <Outlet />{" "}
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthLayout;
