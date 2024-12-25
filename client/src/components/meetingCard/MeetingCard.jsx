import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Image } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const MeetingCard = ({
  title,
  date,
  isPreviousMeeting,
  handleClick,
  buttonIcon1,
  buttonText,
  link,
}) => {
  return (
    <section className="flex min-h-[258px] w-full flex-col justify-between rounded-[14px] bg-dark-1 px-5 py-8 xl:max-w-[568px]">
      <article className="flex flex-col gap-5">
        <div className="flex justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-base font-normal">{date}</p>
          </div>
        </div>
      </article>
      {!isPreviousMeeting && (
        <div className="flex gap-2">
          <Button onClick={handleClick} className="rounded bg-blue-1 px-6">
            {buttonIcon1 && (
              <Image src={buttonIcon1} alt="feature" width={20} height={20} />
            )}
            &nbsp; {buttonText}
          </Button>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(link);
              toast({
                title: "Link Copied",
              });
            }}
            className="bg-dark-4 px-6"
          >
            <Image src="/icons/copy.svg" alt="feature" width={20} height={20} />
            &nbsp; Copy Link
          </Button>
        </div>
      )}
    </section>
  );
};

export default MeetingCard;
