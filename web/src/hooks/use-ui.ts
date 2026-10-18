/* eslint-disable react-hooks/set-state-in-effect -- these hooks intentionally sync initial state on mount */
import { useEffect, useRef, useState } from "react"
import { clockIn } from "@/lib/format"

export function useReducedMotion(): boolean {
  const [reduce, setReduce] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const on = () => setReduce(mq.matches)
    mq.addEventListener("change", on)
    return () => mq.removeEventListener("change", on)
  }, [])
  return reduce
}

/** Counts from 0 to `to` with an ease-out curve once `start` is true. */
export function useCountUp(to: number, start = true, duration = 1400): number {
  const reduce = useReducedMotion()
  const [value, setValue] = useState(reduce ? to : 0)
  useEffect(() => {
    if (!start) return
    if (reduce) {
      setValue(to)
      return
    }
    let raf = 0
    const t0 = performance.now()
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration)
      setValue(Math.round(to * (1 - Math.pow(1 - p, 4))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [to, start, duration, reduce])
  return value
}

/** Types each word, holds, deletes, and moves to the next. */
export function useTypewriter(words: string[]): string {
  const reduce = useReducedMotion()
  const [text, setText] = useState(words[0] ?? "")
  const key = words.join("|")
  useEffect(() => {
    if (!words.length) return
    if (reduce) {
      setText(words[0])
      return
    }
    let i = 0
    let j = 0
    let deleting = false
    let timer: ReturnType<typeof setTimeout>
    const step = () => {
      const w = words[i]
      setText(w.slice(0, j))
      if (!deleting && j < w.length) {
        j++
        timer = setTimeout(step, 55)
      } else if (!deleting) {
        deleting = true
        timer = setTimeout(step, 1500)
      } else if (j > 0) {
        j--
        timer = setTimeout(step, 28)
      } else {
        deleting = false
        i = (i + 1) % words.length
        timer = setTimeout(step, 250)
      }
    }
    step()
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, reduce])
  return text
}

/** HH:MM in a timezone, refreshed every 20 seconds. */
export function useClock(timeZone: string): string {
  const [now, setNow] = useState(() => clockIn(timeZone))
  useEffect(() => {
    setNow(clockIn(timeZone))
    const id = setInterval(() => setNow(clockIn(timeZone)), 20_000)
    return () => clearInterval(id)
  }, [timeZone])
  return now
}

/** True once the element has been on screen at least once. */
export function useSeen<T extends Element>(): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || seen) return
    const io = new IntersectionObserver((e) => {
      if (e.some((x) => x.isIntersecting)) {
        setSeen(true)
        io.disconnect()
      }
    })
    io.observe(el)
    return () => io.disconnect()
  }, [seen])
  return [ref, seen]
}
