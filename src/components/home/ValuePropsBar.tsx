// src/components/sections/ValuePropsBar.tsx
import { Leaf, Sparkles, Truck } from "lucide-react";

const PROPS = [
  { icon: Leaf, title: "100% Natural", desc: "Sourced from nature" },
  { icon: Truck, title: "Global Shipping", desc: "Delivered to 100+ countries" },
  { icon: Sparkles, title: "Handcrafted", desc: "Made by skilled artisans" },
];

export function ValuePropsBar() {
  return (
    <section className="py-12 border-b bg-white w-full">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-10 md:gap-x-8 lg:gap-x-12">
          {PROPS.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-row items-center justify-center gap-4 max-w-xs mx-auto md:max-w-none md:mx-0"
            >
              {/* Icon Circle */}
              <div className="shrink-0 p-3.5 bg-[#f4f1ea] rounded-full text-[#581c1c]">
                <item.icon className="w-6 h-6" strokeWidth={1.5} />
              </div>

              {/* Text */}
              <div className="text-left">
                <h4 className="font-semibold text-sm uppercase tracking-wider text-[#581c1c] mb-0.5">
                  {item.title}
                </h4>
                <p className="text-sm text-muted-foreground leading-tight">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}