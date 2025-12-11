import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/mode-toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BookOpen, Sparkles, Trophy, Users, MessageSquare } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            <h1 className="text-xl font-bold">Eleven Lingo</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/chat">
                <MessageSquare className="mr-2 h-4 w-4" />
                Chat
              </Link>
            </Button>
            <Button variant="ghost">About</Button>
            <Button variant="ghost">Contact</Button>
            <ModeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            AI Powered
          </div>
          <h2 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Learn languages{" "}
            <span className="text-primary">intelligently</span>
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            A modern platform to master new languages with artificial
            intelligence. Personalized, interactive, and effective.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="gap-2" asChild>
              <Link href="/chat">
                Try Now
                <MessageSquare className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Separator className="container mx-auto" />

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="mb-12 text-center text-3xl font-bold">
          Key Features
        </h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <div className="mb-2 flex items-center gap-2">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
              </div>
              <CardTitle>Personalized AI</CardTitle>
              <CardDescription>
                Learn with an AI tutor that adapts to your level and learning
                style
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={75} className="h-2" />
              <p className="mt-2 text-xs text-muted-foreground">
                75% progress
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-2 flex items-center gap-2">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Users className="h-5 w-5 text-primary" />
                </div>
              </div>
              <CardTitle>Active Community</CardTitle>
              <CardDescription>
                Connect with other students and practice in real-time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex -space-x-2">
                <Avatar className="h-8 w-8 border-2 border-background">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>U1</AvatarFallback>
                </Avatar>
                <Avatar className="h-8 w-8 border-2 border-background">
                  <AvatarFallback>U2</AvatarFallback>
                </Avatar>
                <Avatar className="h-8 w-8 border-2 border-background">
                  <AvatarFallback>U3</AvatarFallback>
                </Avatar>
                <Avatar className="h-8 w-8 border-2 border-background">
                  <AvatarFallback>+9</AvatarFallback>
                </Avatar>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                12+ active users
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-2 flex items-center gap-2">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Trophy className="h-5 w-5 text-primary" />
                </div>
              </div>
              <CardTitle>Achievements and Gamification</CardTitle>
              <CardDescription>
                Keep your motivation high with daily challenges and achievements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/20">
                        <Trophy className="h-5 w-5 text-yellow-500" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>7 day streak</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20">
                        <Sparkles className="h-5 w-5 text-blue-500" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>First lesson</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="border-2 border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              Ready to start your journey?
            </CardTitle>
            <CardDescription>
              Join thousands of students already improving their language
              skills
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Input
              placeholder="your@email.com"
              type="email"
              className="sm:w-64"
            />
            <Button>Start Now</Button>
          </CardContent>
          <CardFooter className="justify-center text-xs text-muted-foreground">
            No credit card required
          </CardFooter>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              <span className="text-sm font-medium">Eleven Lingo</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Eleven Lingo. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

