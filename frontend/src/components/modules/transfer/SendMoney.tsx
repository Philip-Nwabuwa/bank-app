import {
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
  Drawer,
} from "@/components/ui/drawer";

import { Button } from "@/components/ui/button";
import { Landmark, SquareUser } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const TransferForm = () => {
  const [step, setStep] = useState(1);

  const next = () => setStep((prevStep) => prevStep + 1);
  const back = () => setStep((prevStep) => prevStep - 1);

  return (
    <>
      <AnimatePresence>
        {step === 1 && <SendMoney next={next} />}
      </AnimatePresence>
    </>
  );
};

const SendMoney = ({ next }: { next: () => void }) => {
  return (
    <motion.div>
      <div>
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
                  <button className="flex gap-4 px-4 py-4 bg-blue-50 rounded-md w-full">
                    <SquareUser />
                    Send to username
                  </button>
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
    </motion.div>
  );
};

export default SendMoney;
