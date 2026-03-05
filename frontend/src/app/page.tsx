import Image from "next/image";

const properties = [
  {
    name: "Seaside Serenity Villa",
    desc: "A stunning 4-bedroom, 3-bathroom villa in a peaceful suburban neighborhood.",
    bed: "4-Bedroom",
    bath: "3-Bathroom",
    type: "Villa",
    price: "$550,000",
    image:
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Metropolitan Haven",
    desc: "A chic and fully-furnished 2-bedroom apartment with panoramic city views.",
    bed: "2-Bedroom",
    bath: "2-Bathroom",
    type: "Villa",
    price: "$550,000",
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Rustic Retreat Cottage",
    desc: "An elegant 3-bedroom, 2.5-bathroom townhouse in a gated community.",
    bed: "3-Bedroom",
    bath: "3-Bathroom",
    type: "Villa",
    price: "$550,000",
    image:
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=80",
  },
];

const testimonials = [
  {
    title: "Exceptional Service!",
    text: "Their team's dedication and professionalism made finding our dream home a breeze. Highly recommended!",
    name: "Wade Warren",
    city: "USA, California",
  },
  {
    title: "Efficient and Reliable",
    text: "Estatein provided us with top-notch service. They helped us sell our property quickly and at a great price.",
    name: "Emelie Thomson",
    city: "USA, Florida",
  },
  {
    title: "Trusted Advisors",
    text: "The Estatein team guided us through the entire buying process and delivered remarkable support.",
    name: "John Mars",
    city: "USA, Nevada",
  },
];

const faqs = [
  {
    q: "How do I search for properties on Estatein?",
    a: "Learn how to use our user-friendly search tools to find properties that match your criteria.",
  },
  {
    q: "What documents do I need to sell my property?",
    a: "Find out about the necessary documentation for listing your property with us.",
  },
  {
    q: "How can I contact an Estatein agent?",
    a: "Discover the different ways you can get in touch with our experienced agents.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0b0d10] text-white">
      <div className="bg-[#E3F3FF] w-[1432px] h-[100px] p-[12px] pl-[24px] pr-[24px] pt-[16px] pb-[16px] flex justify-between items-center">
        <div className="h-[30px] bg-[#E3F3FF] text-[#000000] relative top-auto right-auto bottom-auto left-auto w-[fit-content] flex justify-center items-center rounded-[5px] border text-[16px] m-0 gap-[12px] pr-[24px] pl-[24px] pt-[16px] pb-[16px] border-solid">
          Home
        </div>
      </div>
    </main>
  );
}
