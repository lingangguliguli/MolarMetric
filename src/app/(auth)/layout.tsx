import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="font-semibold text-lg text-white tracking-tight">
              MolarMetric
            </span>
          </Link>
          <div className="max-w-md">
            <h2 className="text-3xl font-semibold text-white leading-tight">
              Turn patient enquiries into booked appointments
            </h2>
            <p className="mt-4 text-white/70 leading-relaxed">
              The complete lead-to-revenue platform for dental clinics.
              Track every enquiry, coordinate follow-ups, and measure what matters.
            </p>
          </div>
          <p className="text-sm text-white/40">
            Dental Revenue Recovery OS
          </p>
        </div>
        {/* Decorative circles */}
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5" />
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
