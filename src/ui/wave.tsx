import { useRef, useState, useEffect } from 'react'

export const Wave = () => {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)
  const [height, setHeight] = useState(0)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (ref.current) {
      const { height, width } = ref.current.getBoundingClientRect()
      setHeight(height)
      setWidth(width)
    }
  }, [ref])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: [0, 0.5, 1]
      }
    )
    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      observer.unobserve(ref.current)
    }
  }, [ref])

  useEffect(() => {
    console.log('IsInView', isInView)
  }, [isInView])

  return (
    <div
      id="Hello"
      className="pointer-events-none absolute top-0
    z-10 grid w-full -translate-y-[99%] grid-cols-10 gap-0 overflow-hidden"
      // :style="`height: ${height}px`"
      style={{
        height
      }}
    >
      <div className="col-span-1" />
      <div className="col-span-8" ref={ref}>
        <svg
          className="text-app-dark-green absolute"
          // :style="`height: ${height}; width: ${width}`"
          style={{
            height,
            width
          }}
          xmlns="http://www.w3.org/2000/svg"
          // :viewBox="`0 0 ${width} ${height}`"
          viewBox={`0 0 ${width} ${height}`}
        >
          <path
            fill="currentColor"
            d={`M 0,${height} C ${width / 2.8},${height * 0.95} ${width / 1.5},
          ${height * 0.05} ${width},0 L ${width},${height} L 0,${height} Z`}
          />
        </svg>
      </div>
      <div className="col-span-1">
        <div
          className="absolute w-full bg-blue-700"
          // :style="`height: ${height}px`"
          style={{
            height
          }}
        />
      </div>
    </div>
  )
}
