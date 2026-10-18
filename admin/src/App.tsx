import { BrowserRouter, Link, Route, Routes } from "react-router-dom"
import { Toaster } from "@/components/admin/Toaster"
import { Shell } from "@/components/admin/Shell"
import { Button } from "@/components/ui/button"
import { Dashboard } from "@/pages/Dashboard"
import { Login } from "@/pages/Login"
import { Messages } from "@/pages/Messages"
import { ProjectEditor } from "@/pages/ProjectEditor"
import { Projects } from "@/pages/Projects"
import { Settings } from "@/pages/Settings"
import { ApproachPage, ExperiencePage, SocialLinksPage, StackPage, TestimonialsPage } from "@/pages/collections"

function NotFound() {
  return (
    <div className="grid place-items-center gap-4 py-24 text-center">
      <p className="font-mono text-sm text-muted-foreground">404</p>
      <h1 className="font-heading text-3xl font-semibold">This page doesn’t exist</h1>
      <Button nativeButton={false} render={<Link to="/" />}>Back to dashboard</Button>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Shell />}>
          <Route index element={<Dashboard />} />
          <Route path="messages" element={<Messages />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/new" element={<ProjectEditor />} />
          <Route path="projects/:id" element={<ProjectEditor />} />
          <Route path="experience" element={<ExperiencePage />} />
          <Route path="approach" element={<ApproachPage />} />
          <Route path="stack" element={<StackPage />} />
          <Route path="testimonials" element={<TestimonialsPage />} />
          <Route path="social-links" element={<SocialLinksPage />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  )
}
