export const DotButton = ({ selected, onClick }) => {
  return (
    <button
      className={`embla__dot ${selected ? 'is-selected' : ''}`}
      type="button"
      onClick={onClick}
    />
  )
}
