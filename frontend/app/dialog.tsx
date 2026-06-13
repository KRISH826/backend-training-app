"use client";

import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const roomMessages = [
  {
    id: 1,
    name: "Ava",
    text: "Welcome in. The room is ready.",
    own: false,
  },
  {
    id: 2,
    name: "You",
    text: "Thanks, I just joined.",
    own: true,
  },
  {
    id: 3,
    name: "Sam",
    text: "Good to see everyone here.",
    own: false,
  },
];

export default function ChatDialog() {
  const [name, setName] = useState("");
  const [joinedName, setJoinedName] = useState("");

  const hasJoined = joinedName.length > 0;

  function handleJoin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    setJoinedName(trimmedName);
  }

  return (
    <>
      {hasJoined ? (
        <Card className="mx-auto min-h-[calc(100vh-80px)] w-full max-w-[800px] md:min-w-[650px]">
          <CardHeader className="border-b">
            <CardTitle>Room Chat</CardTitle>
            <CardDescription>Joined as {joinedName}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col">
            <div className="flex flex-1 flex-col gap-3 rounded-lg bg-muted/40 p-4">
              {roomMessages.map((message) => (
                <div
                  key={message.id}
                  className={
                    message.own
                      ? "ml-auto max-w-[78%] rounded-lg bg-primary px-4 py-3 text-primary-foreground"
                      : "mr-auto max-w-[78%] rounded-lg border bg-background px-4 py-3"
                  }
                >
                  <p className="text-xs font-medium opacity-80">
                    {message.own ? joinedName : message.name}
                  </p>
                  <p className="mt-1 leading-6">{message.text}</p>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t">
            <form
              className="flex w-full flex-col gap-3 sm:flex-row"
              onSubmit={(event) => event.preventDefault()}
            >
              <Textarea
                className="min-h-24 resize-none sm:min-h-16"
                placeholder="Type your message"
              />
              <button
                className="h-10 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
                type="submit"
              >
                Send
              </button>
            </form>
          </CardFooter>
        </Card>
      ) : (
        <div className="mx-auto min-h-[calc(100vh-80px)] w-full max-w-[800px] md:min-w-[650px]" />
      )}

      <Dialog open={!hasJoined}>
        <DialogContent
          className="sm:max-w-sm"
          showCloseButton={false}
          onEscapeKeyDown={(event) => event.preventDefault()}
          onPointerDownOutside={(event) => event.preventDefault()}
        >
          <form className="space-y-5" onSubmit={handleJoin}>
            <DialogHeader>
              <DialogTitle>Enter your name</DialogTitle>
              <DialogDescription className="sr-only">
                Enter your name before joining the room.
              </DialogDescription>
            </DialogHeader>
            <Input
              autoFocus
              placeholder="Enter your name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <button
              className="h-10 w-full rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!name.trim()}
              type="submit"
            >
              Join Room
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
