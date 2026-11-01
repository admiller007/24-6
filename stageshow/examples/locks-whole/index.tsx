import { useEffect, useRef } from 'react'
import { Phone, Scroll, Stage, Window, type Act } from '../../kit'
import { thumb } from '../../kit/measure'
import oldDesk from '../locks-assets/old-full-desktop.webp'
import newDesk from '../locks-assets/new-full-desktop.webp'
import oldMob from '../locks-assets/old-full-mobile.webp'
import newMob from '../locks-assets/new-full-mobile.webp'
import './whole.css'

// The whole page, old beside new. Two windows at one height on the same
// address; a scroll over the new page carries both from the header to the
// footer, the old one keeping pace in proportion so the two reach their
// footers together. The bottoms hold, then the same hand scrolls back up, so
// the loop ends on its first frame with a seen cause.
//
// Focus by depth: After is the story, so it takes the hero shadow and sits in
// front; Before keeps the quieter window shadow.
//
// Real strings: the address, Before and After. The rest is the two pages.

type S = Record<string, never>

async function script(a: Act<S>) {
  await a.wait(900)
  a.mark('scroll')
  await a.scroll('new-page', 99999, { duration: 8000 })
  a.mark('footer')
  await a.wait(2000)
  a.mark('back')
  await a.scroll('new-page', 0, { duration: 1600 })
  await a.wait(1400)   // the scrollbar fades before the loop comes round
}

// The old page follows the new one in proportion, scrollbar and edge fade included
function useFollow() {
  const root = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = root.current
    if (!el) return
    const lead = el.querySelector<HTMLElement>('[data-target="new-page"]')
    const follow = el.querySelector<HTMLElement>('[data-target="old-page"]')
    if (!lead || !follow) return
    const sync = () => {
      const max = lead.scrollHeight - lead.clientHeight
      const p = max > 0 ? lead.scrollTop / max : 0
      follow.scrollTop = p * (follow.scrollHeight - follow.clientHeight)
      follow.toggleAttribute('data-scrolled', follow.scrollTop > 0.5)
      thumb(follow)
    }
    const mirror = new MutationObserver(() => {
      follow.parentElement?.toggleAttribute('data-scrolling', lead.parentElement?.hasAttribute('data-scrolling') ?? false)
    })
    if (lead.parentElement) mirror.observe(lead.parentElement, { attributes: true, attributeFilter: ['data-scrolling'] })
    lead.addEventListener('scroll', sync)
    sync()
    return () => { lead.removeEventListener('scroll', sync); mirror.disconnect() }
  }, [])
  return root
}

function Page({ name, src }: { name: string; src: string }) {
  return (
    <div className="lw-pane">
      <Scroll name={name} className="lw-scroll">
        <img className="lw-page" src={src} alt="" draggable={false} />
      </Scroll>
    </div>
  )
}

// Before and After sit on the frame, never on the page: in the window's
// address bar on the desktop, straddling the phone's foot on the phone
const Tag = ({ side, children }: { side: 'before' | 'after'; children: string }) => <span className={`lw-tag lw-tag--${side}`}>{children}</span>

export function WholeWide() {
  const root = useFollow()
  return (
    <div ref={root}>
      <Stage<S> width={1080} height={520} initial={{}} script={script} cursor={{ at: 'rest', idle: false }} greys="cool" fidelity="realistic" className="lw lw--wide">
        {() => (
          <>
            <Window url="mylocknow.com" className="lw-win lw-win--before">
              <Page name="old-page" src={oldDesk} />
            </Window>
            <Window url="mylocknow.com" className="lw-win lw-win--after">
              <Page name="new-page" src={newDesk} />
            </Window>
            <Tag side="before">Before</Tag>
            <Tag side="after">After</Tag>
            <span className="lw-rest" data-target="rest" />
          </>
        )}
      </Stage>
    </div>
  )
}

export function WholePhone() {
  const root = useFollow()
  return (
    <div ref={root}>
      <Stage<S> width={358} height={352} initial={{}} script={script} greys="cool" fidelity="realistic" className="lw lw--phone">
        {() => (
          <>
            <Phone width={149} frame="soft" status={false} island={false} className="lw-phone lw-phone--before">
              <Page name="old-page" src={oldMob} />
            </Phone>
            <Phone width={149} frame="soft" status={false} island={false} className="lw-phone lw-phone--after">
              <Page name="new-page" src={newMob} />
            </Phone>
            <Tag side="before">Before</Tag>
            <Tag side="after">After</Tag>
          </>
        )}
      </Stage>
    </div>
  )
}

export default function LocksWhole() {
  return (
    <div className="lw-host">
      <div className="lw-host__wide"><WholeWide /></div>
      <div className="lw-host__phone"><WholePhone /></div>
    </div>
  )
}
