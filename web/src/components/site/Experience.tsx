import { ErrorPanel, RowsSkeleton } from "./states"
import { useExperience, useSettings } from "@/hooks/use-content"

export function Experience() {
  const q = useExperience()
  const settings = useSettings().data
  const items = q.data ?? []

  return (
    <section className="sec" id="experience">
      <div className="wrap">
        <div className="sec-head rv">
          <div>
            <div className="eyebrow">
              Experience <b>/ 2025 – now</b>
            </div>
            <h2>Four roles, one habit: own the outcome.</h2>
          </div>
          <p>From an independent studio to a production ERP, a hospital system and a recruitment platform.</p>
        </div>

        {q.isPending && <RowsSkeleton rows={3} height={150} />}
        {q.isError && <ErrorPanel error={q.error} onRetry={() => q.refetch()} />}
        {q.isSuccess && items.length === 0 && <p style={{ color: "var(--fg-3)" }}>Experience hasn’t been published yet.</p>}
        {q.isSuccess && items.length > 0 && (
          <div className="tl">
            <span className="spine" aria-hidden="true">
              <i />
            </span>
            {items.map((j) => (
              <article className="job rv" key={j.id}>
                <div>
                  <div className="when">{j.period}</div>
                  <div className="where">{j.company}</div>
                </div>
                <div>
                  <h3>{j.title}</h3>
                  <p>{j.description}</p>
                  {j.tags.length > 0 && (
                    <ul>
                      {j.tags.map((t) => (
                        <li className="chip" key={t}>
                          {t}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        {settings && (settings.educationSchool || settings.languages) && (
          <div className="edu rv">
            {settings.educationSchool && <b>{settings.educationSchool}</b>}
            {settings.educationDegree && <span>{settings.educationDegree}</span>}
            {settings.languages && <span>{settings.languages}</span>}
          </div>
        )}
      </div>
    </section>
  )
}
