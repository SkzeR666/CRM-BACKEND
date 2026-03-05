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
      <div className="border-b border-white/10 bg-[#111318] py-2 text-center text-xs text-white/80">
        Discover Your Dream Property with Estatein
      </div>

      <section className="mx-auto max-w-[1240px] px-4 pb-8 pt-4 md:px-8">
        <header className="mb-6 flex items-center justify-between rounded-2xl border border-white/10 bg-[#12151c] px-4 py-4 md:px-6">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <span className="inline-block h-6 w-6 rounded-full bg-[#17c56a]" />
            Estatein
          </div>
          <nav className="hidden items-center gap-2 rounded-xl border border-white/10 bg-[#0c0f14] p-1 text-sm md:flex">
            {["Home", "About Us", "Properties", "Services"].map((item) => (
              <button
                key={item}
                className="rounded-lg px-4 py-2 text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                {item}
              </button>
            ))}
          </nav>
          <button className="rounded-xl border border-white/15 bg-[#0f1218] px-4 py-2 text-sm">
            Contact Us
          </button>
        </header>

        <div className="grid-lines overflow-hidden rounded-2xl border border-white/10 md:grid md:grid-cols-2">
          <div className="bg-[#0c0f14]/90 p-7 md:p-12">
            <h1 className="max-w-xl text-4xl font-semibold leading-tight md:text-6xl">
              Discover Your Dream Property with Estatein
            </h1>
            <p className="mt-5 max-w-lg text-sm text-white/65 md:text-base">
              Your journey to finding the perfect property begins here. Explore
              our listings to find the home that reflects your style.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button className="rounded-xl border border-white/20 bg-transparent px-5 py-3 text-sm font-medium">
                Learn More
              </button>
              <button className="rounded-xl bg-[#17c56a] px-5 py-3 text-sm font-semibold text-black">
                Browse Properties
              </button>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                ["200+", "Happy Customers"],
                ["10k+", "Properties For Clients"],
                ["16+", "Years of Experience"],
              ].map(([v, l]) => (
                <article
                  key={l}
                  className="rounded-xl border border-white/10 bg-[#11151c] p-4"
                >
                  <p className="text-3xl font-semibold">{v}</p>
                  <p className="mt-1 text-xs text-white/60">{l}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="relative flex min-h-[460px] items-end justify-center bg-gradient-to-br from-[#101623] via-[#162447] to-[#2ccf7a] p-6">
            <div className="hero-building h-[75%] w-[30%] rounded-t-3xl shadow-[0_20px_120px_rgba(21,97,255,0.5)]" />
            <div className="hero-building ml-[-3%] h-[88%] w-[28%] rounded-t-3xl" />
            <div className="hero-building ml-[-3%] h-[65%] w-[25%] rounded-t-3xl" />
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-4">
          {[
            "Find Your Dream Home",
            "Unlock Property Value",
            "Effortless Property Management",
            "Smart Investments, Informed Decisions",
          ].map((item) => (
            <div
              key={item}
              className="rounded-xl border border-white/10 bg-[#11151c] p-5 text-center text-sm"
            >
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-[#17c56a]/60 text-[#17c56a]">
                *
              </div>
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-4 py-10 md:px-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-3xl font-semibold">Featured Properties</p>
            <p className="mt-2 max-w-2xl text-sm text-white/60">
              Explore our hand-picked selection of featured properties. Each
              listing offers a glimpse into exceptional homes and investments.
            </p>
          </div>
          <button className="hidden rounded-xl border border-white/15 px-4 py-2 text-sm md:block">
            View All Properties
          </button>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {properties.map((property) => (
            <article
              key={property.name}
              className="rounded-2xl border border-white/10 bg-[#10141a] p-4"
            >
              <div className="relative h-44 w-full overflow-hidden rounded-xl">
                <Image
                  src={property.image}
                  alt={property.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="mt-4 text-xl font-semibold">{property.name}</h3>
              <p className="mt-2 text-sm text-white/60">{property.desc}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <span className="rounded-lg border border-white/15 px-3 py-1">
                  {property.bed}
                </span>
                <span className="rounded-lg border border-white/15 px-3 py-1">
                  {property.bath}
                </span>
                <span className="rounded-lg border border-white/15 px-3 py-1">
                  {property.type}
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/50">Price</p>
                  <p className="text-2xl font-semibold">{property.price}</p>
                </div>
                <button className="rounded-xl bg-[#17c56a] px-4 py-2 text-sm font-semibold text-black">
                  View Property Details
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-4 py-10 md:px-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-3xl font-semibold">What Our Clients Say</p>
            <p className="mt-2 max-w-2xl text-sm text-white/60">
              Read the success stories and heartfelt testimonials from our
              valued clients.
            </p>
          </div>
          <button className="hidden rounded-xl border border-white/15 px-4 py-2 text-sm md:block">
            View All Testimonials
          </button>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {testimonials.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-white/10 bg-[#10141a] p-6"
            >
              <p className="mb-3 text-[#f0c044]">*****</p>
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="mt-3 text-sm text-white/60">{item.text}</p>
              <div className="mt-5">
                <p className="font-medium">{item.name}</p>
                <p className="text-xs text-white/50">{item.city}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-4 py-10 md:px-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-3xl font-semibold">Frequently Asked Questions</p>
            <p className="mt-2 max-w-2xl text-sm text-white/60">
              Find answers to common questions about our services, property
              listings and real estate process.
            </p>
          </div>
          <button className="hidden rounded-xl border border-white/15 px-4 py-2 text-sm md:block">
            View All FAQs
          </button>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {faqs.map((item) => (
            <article
              key={item.q}
              className="rounded-2xl border border-white/10 bg-[#10141a] p-6"
            >
              <h3 className="text-xl font-semibold">{item.q}</h3>
              <p className="mt-3 text-sm text-white/60">{item.a}</p>
              <button className="mt-5 rounded-lg border border-white/20 px-4 py-2 text-sm">
                Read More
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-4 pb-10 pt-4 md:px-8">
        <div className="grid-lines rounded-2xl border border-white/10 bg-[#0f1218] p-8 md:flex md:items-center md:justify-between">
          <div>
            <h2 className="text-4xl font-semibold">
              Start Your Real Estate Journey Today
            </h2>
            <p className="mt-3 max-w-3xl text-sm text-white/65">
              Whether you&apos;re looking for a new home, strategic investment,
              or expert advice, Estatein is here to assist every step.
            </p>
          </div>
          <button className="mt-4 rounded-xl bg-[#17c56a] px-5 py-3 text-sm font-semibold text-black md:mt-0">
            Explore Properties
          </button>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#0a0c10]">
        <div className="mx-auto grid max-w-[1240px] gap-8 px-4 py-10 md:grid-cols-5 md:px-8">
          <div>
            <p className="mb-3 text-xl font-semibold">Estatein</p>
            <div className="flex rounded-xl border border-white/10 bg-[#11151c] p-2">
              <input
                className="w-full bg-transparent px-2 text-sm text-white outline-none"
                placeholder="Enter Your Email"
              />
              <button className="rounded-lg bg-[#17c56a] px-3 text-black">
                -&gt;
              </button>
            </div>
          </div>
          <div className="text-sm text-white/70">
            <p className="mb-2 text-white">Home</p>
            <p>Hero Section</p>
            <p>Features</p>
            <p>Properties</p>
            <p>FAQs</p>
          </div>
          <div className="text-sm text-white/70">
            <p className="mb-2 text-white">About Us</p>
            <p>Our Story</p>
            <p>How It Works</p>
            <p>Our Team</p>
            <p>Our Clients</p>
          </div>
          <div className="text-sm text-white/70">
            <p className="mb-2 text-white">Properties</p>
            <p>Portfolio</p>
            <p>Categories</p>
          </div>
          <div className="text-sm text-white/70">
            <p className="mb-2 text-white">Contact Us</p>
            <p>Contact Form</p>
            <p>Our Offices</p>
          </div>
        </div>
        <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
          (c)2026 Estatein. All Rights Reserved.
        </div>
      </footer>
    </main>
  );
}
