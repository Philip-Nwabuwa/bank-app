import { useUserStore } from "@/store/useUser";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Landmark, MoreVertical, SquareUser } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Dashboard = () => {
  const entireState = useUserStore.getState();
  const user = useUserStore.getState().user;
  console.log(entireState);
  console.log(user.firstName);
  console.log(user.email);

  return (
    <section className="min-h-screen grid grid-rows-7 py-3 pl-3 gap-4">
      <div className="row-span-2 flex items-center justify-between gap-6">
        <div className="bg-slate-100 w-full h-full rounded-e-md rounded-es-md flex flex-col p-6">
          <div className="flex items-center justify-between">
            <div className="font-bold text-2xl">Account 992*******</div>
            <div>
              <MoreVertical />
            </div>
          </div>
          <div className="font-bold text-[36px] pt-8">$10,500.00 USD</div>
          <p className="pt-6">Available Balance</p>
        </div>
        <div className="bg-slate-100 w-full h-full rounded-md p-6">card</div>
      </div>
      <div className="flex justify-between rounded-md gap-6 row-span-1 ">
        <div className="flex w-full items-center justify-center rounded-md gap-6 bg-slate-100">
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline">Transfer</Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="mx-auto w-full max-w-sm">
                <DrawerHeader>
                  <DrawerTitle className="text-center">
                    Transfer Funds
                  </DrawerTitle>
                  <DrawerDescription className="text-center">
                    Send money to another user via Account number or Username.
                  </DrawerDescription>
                </DrawerHeader>
                <div className="p-4 pb-0">
                  <div className="flex flex-col justify-center gap-3 h-[120px]">
                    <div className="flex gap-4 px-4 py-4 bg-blue-50 rounded-md">
                      <Landmark /> Send to Account
                    </div>
                    <div className="flex gap-4 px-4 py-4 bg-blue-50 rounded-md">
                      {" "}
                      <SquareUser />
                      Send to username
                    </div>
                  </div>
                </div>
                <DrawerFooter>
                  <Button>Next</Button>
                  <DrawerClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DrawerClose>
                </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline">deposit</Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="mx-auto w-full max-w-sm">
                <DrawerHeader>
                  <DrawerTitle className="text-center">
                    Transfer Funds
                  </DrawerTitle>
                  <DrawerDescription className="text-center">
                    Send money to another user via Account number or Username.
                  </DrawerDescription>
                </DrawerHeader>
                <div className="p-4 pb-0">
                  <div className="flex flex-col justify-center gap-3 h-[120px]">
                    <div className="flex gap-4 px-4 py-4 bg-blue-50 rounded-md">
                      <Landmark /> Send to Account
                    </div>
                    <div className="flex gap-4 px-4 py-4 bg-blue-50 rounded-md">
                      {" "}
                      <SquareUser />
                      Send to username
                    </div>
                  </div>
                </div>
                <DrawerFooter>
                  <Button>Next</Button>
                  <DrawerClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DrawerClose>
                </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline">witdraw</Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="mx-auto w-full max-w-sm">
                <DrawerHeader>
                  <DrawerTitle className="text-center">
                    Transfer Funds
                  </DrawerTitle>
                  <DrawerDescription className="text-center">
                    Send money to another user via Account number or Username.
                  </DrawerDescription>
                </DrawerHeader>
                <div className="p-4 pb-0">
                  <div className="flex flex-col justify-center gap-3 h-[120px]">
                    <div className="flex gap-4 px-4 py-4 bg-blue-50 rounded-md">
                      <Landmark /> Send to Account
                    </div>
                    <div className="flex gap-4 px-4 py-4 bg-blue-50 rounded-md">
                      {" "}
                      <SquareUser />
                      Send to username
                    </div>
                  </div>
                </div>
                <DrawerFooter>
                  <Button>Next</Button>
                  <DrawerClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DrawerClose>
                </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
        <div className="bg-slate-100 flex flex-col items-center justify-center gap-2 rounded-md w-full">
          <div>Send Again</div>
          <div className="flex gap-6">
            <div className="p-4 bg-black">more</div>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
      <div className="row-span-3 bg-slate-100">Recent transactions</div>
    </section>
  );
};

export default Dashboard;
