import LocksSlider, { SliderPhone, SliderWide } from '../examples/locks-slider'
import LocksWhole, { WholePhone, WholeWide } from '../examples/locks-whole'

export function App() {
  return (
    <main className="page">
      <header className="intro">
        <h1>mylocknow.com, before and after</h1>
        <p>The old homepage and the new one, captured at the same screen size. <a href="/">Open the new homepage</a></p>
      </header>
      <section aria-label="The top of the page, with a slider between the old and new versions">
        <LocksSlider />
      </section>
      <section aria-labelledby="whole">
        <h2 id="whole">The whole page</h2>
        <LocksWhole />
      </section>
    </main>
  )
}

const STAGES: Record<string, { el: JSX.Element; w: number }> = {
  'slider-wide': { el: <SliderWide />, w: 1080 },
  'slider-phone': { el: <SliderPhone />, w: 358 },
  'whole-wide': { el: <WholeWide />, w: 1080 },
  'whole-phone': { el: <WholePhone />, w: 358 },
}

export function Recording({ name }: { name: string }) {
  const s = STAGES[name]
  return <div id="rec" style={{ width: s.w }}>{s.el}</div>
}
