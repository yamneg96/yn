import { coverSvg } from "@/lib/art"
import type { Project } from "@/lib/types"

/**
 * A project's cover: the uploaded image when there is one, otherwise the generated art.
 * The art markup is built from validated hex colours and an HTML-escaped name.
 */
export function CoverArt({ project, big = false }: { project: Project; big?: boolean }) {
  if (project.coverImageUrl) {
    return <img src={project.coverImageUrl} alt={`${project.name} cover`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
  }
  return <div style={{ width: "100%", height: "100%" }} dangerouslySetInnerHTML={{ __html: coverSvg(project, big) }} />
}
