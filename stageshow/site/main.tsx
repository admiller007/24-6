import { installVirtualClock } from '../kit/clock'
import './site.css'

// ?record=<stage> renders one stage at its design size on the kit's virtual
// clock, so a recorder can step it frame by frame. Otherwise: the page.
const record = new URLSearchParams(location.search).get('record')
if (record) installVirtualClock({ fps: 30 })

const [{ createRoot }, { App, Recording }] = await Promise.all([import('react-dom/client'), import('./App')])
createRoot(document.getElementById('root')!).render(record ? <Recording name={record} /> : <App />)
