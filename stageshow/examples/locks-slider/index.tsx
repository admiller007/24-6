import { Phone, Stage, Window, type Act } from '../../kit'
import oldDesk from '../locks-assets/old-top-desktop.webp'
import newDesk from '../locks-assets/new-top-desktop.webp'
import oldMob from '../locks-assets/old-top-mobile.webp'
import newMob from '../locks-assets/new-top-mobile.webp'
import './slider.css'

// Before and after: one browser window on the real mylocknow.com, the old
// homepage under the new one, a divider between them. How it feels to use:
// the hand takes the divider, drags it across, and the new page appears under
// it; the payoff (the new page whole) holds, then the same hand drags it back,
// so the loop ends where it began with a seen cause.
//
// Real strings: the address, Before and After. Everything else is the two
// real pages, captured at the same size.

// h is where the handle sits in the view. The handle keeps a gutter from the
// edges; over its last stretch the line runs ahead of it to the edge, so each
// end of the drag shows one page whole with no sliver of the other.
type S = { h: number }

type Design = { w: number; inset: number; tag: [number, number] }
const WIDE: Design = { w: 960, inset: 34, tag: [120, 60] }
const PHONE: Design = { w: 402, inset: 34, tag: [110, 48] }  // iPhone points

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))
const lineOf = (h: number, d: Design) => {
  const i = d.inset
  if (h <= 2 * i) return Math.max(0, (h - i) * 2)
  if (h >= d.w - 2 * i) return Math.min(d.w, d.w - (d.w - i - h) * 2)
  return h
}
const straight = (p: number, from: { x: number; y: number }, to: { x: number; y: number }) => ({ x: from.x + (to.x - from.x) * p, y: from.y })

// Drag the handle from one stop to the other, carried by the hand exactly
// (k converts the view's own px to stage px: 1 in the window, the phone's point scale on the phone)
async function slide(a: Act<S>, d: Design, from: number, to: number, duration: number) {
  const k = a.rect('view').width / d.w
  const start = a.center('handle')
  await a.drag({ x: start.x + (to - from) * k, y: start.y }, (at, origin) => {
    a.put({ h: clamp(from + (at.x - origin.x) / k, d.inset, d.w - d.inset) })
  }, { duration, cursor: 'preserve', path: straight })
  a.put({ h: to })   // land exactly on the stop, so the loop's last frame is its first
}

function makeScript(d: Design) {
  return async (a: Act<S>) => {
    const end = d.w - d.inset, open = d.inset
    await a.wait(700)
    a.mark('reach')
    await a.move({ at: 'handle', x: 0.5, y: 0.5 })
    a.mark('drag')
    await slide(a, d, end, open, 2600)
    a.mark('payoff')
    await a.wait(2400)
    a.mark('back')
    await slide(a, d, open, end, 2200)
    await a.move('rest')
    await a.wait(500)
  }
}

function Compare({ s, d, oldSrc, newSrc }: { s: S; d: Design; oldSrc: string; newSrc: string }) {
  const [start, span] = d.tag
  const x = lineOf(s.h, d)
  const before = clamp((x - start) / span, 0, 1)
  const after = clamp((d.w - x - start) / span, 0, 1)
  const edge = clamp(Math.min(x, d.w - x) / 48, 0, 1)
  return (
    <div className="ls-view" data-target="view" style={{ ['--x' as string]: `${x}px`, ['--h' as string]: `${s.h}px`, ['--edge' as string]: edge }}>
      <img className="ls-page" src={oldSrc} alt="" draggable={false} />
      <img className="ls-page ls-page--new" src={newSrc} alt="" draggable={false} />
      <span className="ls-tag ls-tag--before" style={{ opacity: before }}>Before</span>
      <span className="ls-tag ls-tag--after" style={{ opacity: after }}>After</span>
      <span className="ls-line" />
      <span className="ls-handle" data-target="handle" data-cursor="resize-ew">
        <svg viewBox="0 0 24 24" aria-hidden><path d="m9 7-5 5 5 5" /><path d="m15 7 5 5-5 5" /></svg>
      </span>
    </div>
  )
}

export function SliderWide() {
  return (
    <Stage<S>
      width={1080} height={620}
      initial={{ h: WIDE.w - WIDE.inset }}
      poster={{ h: WIDE.w / 2 }}
      script={makeScript(WIDE)}
      cursor={{ at: 'rest' }}
      greys="cool"
      fidelity="realistic"
      className="ls ls--wide"
    >
      {(s) => (
        <>
          <Window url="mylocknow.com" className="ls-win">
            <Compare s={s} d={WIDE} oldSrc={oldDesk} newSrc={newDesk} />
          </Window>
          <span className="ls-rest" data-target="rest" />
        </>
      )}
    </Stage>
  )
}

export function SliderPhone() {
  return (
    <Stage<S>
      width={358} height={600}
      initial={{ h: PHONE.w - PHONE.inset }}
      poster={{ h: PHONE.w / 2 }}
      script={makeScript(PHONE)}
      cursor={{ at: 'rest', style: 'touch' }}
      greys="cool"
      fidelity="realistic"
      className="ls ls--phone"
    >
      {(s) => (
        <>
          <Phone width={310} className="ls-phone">
            <Compare s={s} d={PHONE} oldSrc={oldMob} newSrc={newMob} />
          </Phone>
          <span className="ls-rest" data-target="rest" />
        </>
      )}
    </Stage>
  )
}

export default function LocksSlider() {
  return (
    <div className="ls-host">
      <div className="ls-host__wide"><SliderWide /></div>
      <div className="ls-host__phone"><SliderPhone /></div>
    </div>
  )
}
