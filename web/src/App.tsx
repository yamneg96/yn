import { BrowserRouter, Route, Routes } from "react-router-dom"
import { About } from "@/components/site/About"
import { Approach } from "@/components/site/Approach"
import { CaseFile } from "@/components/site/CaseFile"
import { Contact } from "@/components/site/Contact"
import { Experience } from "@/components/site/Experience"
import { Hero } from "@/components/site/Hero"
import { Sprite } from "@/components/site/Icon"
import { Nav } from "@/components/site/Nav"
import { NotFound } from "@/components/site/NotFound"
import { Projects } from "@/components/site/Projects"
import { Stack } from "@/components/site/Stack"
import { Ticker } from "@/components/site/Ticker"
import { Toaster } from "@/components/site/Toaster"
import { Words } from "@/components/site/Words"
import { useSettings } from "@/hooks/use-content"

function Home() {
  const settings = useSettings().data
  return (
    <>
      <Nav initials={settings?.initials} resumeUrl={settings?.resumeUrl} />
      <main id="top">
        <Hero />
        <Ticker />
        <About />
        <hr className="hair" />
        <Projects />
        <hr className="hair" />
        <Stack />
        <hr className="hair" />
        <Experience />
        <hr className="hair" />
        <Words />
        <hr className="hair" />
        <Approach />
      </main>
      <Contact />
      <CaseFile />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Sprite />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  )
}
