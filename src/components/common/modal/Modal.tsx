import type { Props as ReactModalProps } from 'react-modal'
import ReactModal from 'react-modal'

/**
 * Renders the modal component.
 *
 * @param {ReactModal.Props} props - The props.
 * @returns {JSX.Element} - The HTML Markup.
 */
export const ModalComponent = (props: ReactModalProps) => {
  const { children, className = '', isOpen, onRequestClose } = props

  ReactModal.setAppElement('#__next')

  return (
    <ReactModal
      {...props}
      className={`${className}`}
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      shouldCloseOnOverlayClick
      shouldCloseOnEsc
    >
      {children}
    </ReactModal>
  )
}
