import { SPRITE_MARKUP, type IconName } from "./sprite-markup"

/** Mounted once; every <Icon /> references a symbol in this sprite. */
export function Sprite() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" dangerouslySetInnerHTML={{ __html: SPRITE_MARKUP }} />
  )
}

export function Icon({ name, className, size }: { name: IconName; className?: string; size?: number }) {
  return (
    <svg className={className} width={size} height={size} aria-hidden="true" focusable="false">
      <use href={`#i-${name}`} />
    </svg>
  )
}

export type { IconName }
