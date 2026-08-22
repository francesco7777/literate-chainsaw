import { SponsorForm } from "@/components/SponsorForm";
import { createSponsor } from "../actions";

export default function NewSponsorPage() {
  return (
    <div>
      <h1>Neuer Sponsor</h1>
      <SponsorForm action={createSponsor} />
    </div>
  );
}
