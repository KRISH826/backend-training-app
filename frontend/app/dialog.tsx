"use client";

import { useEffect, useRef, useState } from "react";
import type { Socket } from "socket.io-client";

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
import { wsServer } from "@/lib/utils";

interface messagePayloadType {
  id: string;
  name: string;
  text: string;
  own: boolean;
  timestamp: string;
}

const roomMessages = [
  {
    id: "1",
    name: "Ava",
    text: "Welcome in. The room is ready.",
    own: false,
  },
  {
    id: "2",
    name: "You",
    text: "Thanks, I just joined.",
    own: true,
  },
  {
    id: "3",
    name: "Sam",
    text: "Good to see everyone here.",
    own: false,
  },
];

export default function ChatDialog() {
  const [name, setName] = useState("");
  const [joinedName, setJoinedName] = useState("");
  const socketRef = useRef<Socket | null>(null);
  const [messages, setMessages] = useState(roomMessages);
  const [text, setText] = useState("");

  useEffect(() => {
    const socket = wsServer();
    socketRef.current = socket;
    socket.on("connect", () => {
      socket.on("roomNotice", (name) => {
        console.log(`${name} is new member now in our group`)
      });

      socket.on("chatMessage", (msg: messagePayloadType) => {
        setMessages((prev) => [...prev, {
          id: msg.id,
          name: msg.name,
          text: msg.text,
          own: false, // Kyunki yeh kisi aur ka message hai
          timestamp: msg.timestamp
        }])
      })
    });

    return () => {
      socket.disconnect();
    };
  }, [joinedName]);

  

  const hasJoined = joinedName.length > 0;

  function handleJoin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      return;
    }
    setJoinedName(trimmedName);
     socketRef.current?.emit("joinRoom", { name: trimmedName });
  }

  const sendMessage = (
    event?: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
      event?.preventDefault();
      if(!text.trim()) {
        return
      }

      const messagePayload = {
        id: String(Date.now()),
        name: joinedName,
        text: text,
        timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}),
      }

      setMessages((prev) => [
      ...prev,
      { ...messagePayload, own: true }, // 'own: true' taaki humari unique alignment styling mile
    ]);
  }

  return (
    <>
      {hasJoined ? (
        <Card className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-[800px]  py-0! gap-0 rounded-lg shadow-sm md:min-w-[650px]">
          <CardHeader className="border-b px-5 py-4">
            <CardTitle className="text-lg leading-none">Room Chat</CardTitle>
            <CardDescription className="text-xs">
              Joined as {joinedName}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex min-h-0 flex-1 flex-col px-5 py-4">
            <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto rounded-md bg-muted/40 p-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={
                    message.own
                      ? "ml-auto max-w-[82%] rounded-md bg-primary px-3 py-2 text-primary-foreground"
                      : "mr-auto max-w-[82%] rounded-md border bg-background px-3 py-2"
                  }
                >
                  <p className="text-xs font-medium opacity-80">
                    {message.own ? joinedName : message.name}
                  </p>
                  <p className="mt-1 leading-5">{message.text}</p>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t px-5 py-4">
            <form
              className="grid w-full grid-cols-1 gap-3 sm:grid-cols-[1fr_auto] sm:items-end"
              onSubmit={(event) => event.preventDefault()}
            >
              <Textarea
                className="max-h-32 min-h-11 resize-none py-2.5"
                placeholder="Type your message"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    sendMessage(event);
                  }
                }}
              />
              <button
                className="h-11 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80 sm:w-24"
                type="submit"
                disabled={!text.trim()}
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
          className="gap-4 rounded-lg p-5 shadow-2xl sm:max-w-[360px]"
          showCloseButton={false}
          onEscapeKeyDown={(event) => event.preventDefault()}
          onPointerDownOutside={(event) => event.preventDefault()}
        >
          <form className="space-y-4" onSubmit={handleJoin}>
            <DialogHeader className="gap-1">
              <DialogTitle className="text-lg">Enter your name</DialogTitle>
              <DialogDescription className="sr-only">
                Enter your name before joining the room.
              </DialogDescription>
            </DialogHeader>
            <Input
              autoFocus
              className="h-10"
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
