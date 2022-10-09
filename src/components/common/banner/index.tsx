export const Banner = () => {
  return (
    <div className="sticky top-0 z-50 flex h-10 items-center bg-[#173d2f] px-6 font-haboro-soft text-[16px] text-white">
      <p className="font-normal">
        <span className="font-semibold">Free delivery over $79 in Victoria</span>{' '}
        <span className="hidden sm:inline-block">(National delivery coming soon)</span>
      </p>
    </div>
  )
}
