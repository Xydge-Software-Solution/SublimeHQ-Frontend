export default function StatsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="w-40 h-40 rounded-full bg-[#0B1B3D] text-white flex flex-col items-center justify-center text-center shadow-xl">
          <span className="text-4xl font-bold mb-1">500</span>
          <span className="text-sm text-blue-200">Stores<br/>created</span>
        </div>
        <div className="w-40 h-40 rounded-full bg-[#0B1B3D] text-white flex flex-col items-center justify-center text-center shadow-xl">
          <span className="text-4xl font-bold mb-1">5k+</span>
          <span className="text-sm text-blue-200">Products<br/>sold</span>
        </div>
        <div className="w-40 h-40 rounded-full bg-[#0B1B3D] text-white flex flex-col items-center justify-center text-center shadow-xl">
          <span className="text-4xl font-bold mb-1">$1M</span>
          <span className="text-sm text-blue-200">Paid out to<br/>creators</span>
        </div>
      </div>
    </section>
  );
}
