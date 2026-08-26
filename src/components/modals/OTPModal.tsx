"use client"

import { Button, InputOtp, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

const INITIAL_COOLDOWN = 30;
const COOLDOWN_STEP = 30;
const MAX_COOLDOWN = 5 * 60;

export const OTPModalCard = ({
  isOpen,
  onOpenChange,
  handleSet,
  resendOtp,
  isLoading,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  handleSet: (otp: string) => Promise<void>;
  resendOtp: () => void;
  isLoading: boolean;
}) => {
  const [otp, setOtp] = useState("");
  const [cooldown, setCooldown] = useState(INITIAL_COOLDOWN);
  const [resendCount, setResendCount] = useState(0);

  useEffect(() => {
    if (!isOpen) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOtp("");
    setCooldown(INITIAL_COOLDOWN);
    setResendCount(0);
  }, [isOpen]);

  /**
   * Countdown timer.
   *
   * The timer only runs while the modal is open
   * and there is an active cooldown.
   */
  useEffect(() => {
    if (!isOpen || cooldown <= 0) return;

    const timer = window.setInterval(() => {
      setCooldown((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isOpen, cooldown]);

  const handleClose = () => {
    setOtp("");
    setCooldown(INITIAL_COOLDOWN);
    setResendCount(0);

    onOpenChange();
  };

  const handleSubmit = async () => {
    if (otp.length !== 6 || isLoading) return;
    await handleSet(otp);
    setOtp("")
  };

  const handleResend = () => {
    if (isLoading || cooldown > 0) return;

    setOtp("");

    const nextResendCount = resendCount + 1;

    const nextCooldown = Math.min(
      nextResendCount * COOLDOWN_STEP,
      MAX_COOLDOWN,
    );

    setResendCount(nextResendCount);
    setCooldown(nextCooldown);

    resendOtp();
  };

  const formatCooldown = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={handleClose}
      placement="center"
      size="sm"
      backdrop="blur"
      classNames={{
        base: "border border-divider bg-background shadow-2xl",
        backdrop: "bg-black/50 backdrop-blur-sm",
      }}
    >
      <ModalContent>
        <>
          <ModalHeader className="flex flex-col items-center gap-4 pt-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <ShieldCheck size={28} strokeWidth={2} />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-xl font-semibold tracking-tight">
                Verify Your OTP
              </h2>

              <p className="max-w-[280px] text-sm font-normal leading-relaxed text-default-500">
                Enter the 6-digit verification code we sent to you.
              </p>
            </div>
          </ModalHeader>

          <ModalBody className="px-6 pb-3">
            <div className="flex flex-col items-center gap-5">
              <InputOtp
                length={6}
                value={otp}
                onValueChange={setOtp}
                variant="bordered"
                radius="lg"
                isDisabled={isLoading}
              />
            </div>
          </ModalBody>

          <ModalFooter className="flex-col gap-3 px-6 pb-7">
            <Button
              fullWidth
              color="primary"
              size="lg"
              radius="lg"
              isLoading={isLoading}
              isDisabled={otp.length !== 6}
              startContent={
                !isLoading ? (
                  <CheckCircle2 size={18} />
                ) : undefined
              }
              onPress={handleSubmit}
            >
              Verify Code
            </Button>

            <Button
              variant="light"
              size="sm"
              isDisabled={isLoading || cooldown > 0}
              onPress={handleResend}
            >
              {cooldown > 0
                ? `Resend code in ${formatCooldown(cooldown)}`
                : "Resend code"}
            </Button>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
};