
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react";

export function ChatDialog({setActiveChannel,activeChannel,createChannel,newChannelName,setNewChannelName}) {
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Create Channel</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a new Active channel</DialogTitle>
          <DialogDescription>
         Channel created here will be visible to everyone, and everyone will have an access to join the channel.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="Name" className="text-right">
              Channel name:
            </Label>
            <Input id="name"className="col-span-3" value={newChannelName}  onChange={(e) => setNewChannelName(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={createChannel}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}