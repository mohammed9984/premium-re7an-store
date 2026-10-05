export default function Loading() {
  return (
    <div className="shell py-16">
      <div className="skeleton h-10 w-64 rounded-full" />
      <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {[0, 1, 2, 3].map((index) => (
          <div key={index} className="skeleton h-80 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
