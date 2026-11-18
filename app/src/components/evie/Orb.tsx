export default function Orb({ small = false, active = false }: { small?: boolean; active?: boolean }) {
  return <span className={`evie-orb${small ? ' evie-orb-small' : ''}${active ? ' evie-orb-active' : ''}`} aria-hidden="true" />;
}
