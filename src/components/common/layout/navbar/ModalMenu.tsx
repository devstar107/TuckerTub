import styled from '@emotion/styled'

import { DesktopLinks } from '~/constants'
import { useDisableBodyScroll } from '~/hooks/useDisableScroll'

import { ModalComponent } from '../../modal'
import { RenderLinks } from './helpers'
import { LinkType } from './helpers/RenderLinks'

/**
 * Renders the ModalMenu component.
 *
 * @param {*} props - The props.
 * @returns {JSX.Element} - The HTML Markup.
 */
export const ModalMenu = props => {
  const { closeModalEvent, isOpen } = props

  useDisableBodyScroll(isOpen)

  return (
    <ModalComponentStyles
      {...props}
      className={`fixed top-0 left-0 w-full h-full overflow-hidden flex justify-center items-center z-[2]${
        isOpen ? 'visible' : 'hidden'
      }`}
    >
      <div
        id="overlay-container"
        className={`bg-black bg-opacity-80 rounded-full w-[200vw] h-[200vh] flex flex-none justify-center items-center transition-all${
          isOpen ? 'scale(1)' : 'scale(0)'
        }`}
        onClick={event => {
          return closeModalEvent(event)
        }}
        role="button"
        tabIndex={0}
      >
        <div
          id="modal-container"
          className={`text-center max-w-[90vw] max-h-screen transition-opacity${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <ul className="p-0 space-y-6 text-lg list-none text-white select-none">
            <RenderLinks linkType={LinkType.MENU} linkFunction={DesktopLinks} />
          </ul>
        </div>
      </div>
    </ModalComponentStyles>
  )
}

const ModalComponentStyles = styled(ModalComponent)`
  .modal-container ul li {
    padding: 1rem 0;
  }

  .modal-container ul li a {
    color: inherit;
    text-decoration: none;
    transition: color 0.4s ease;
  }

  .modal-container ul li a:hover {
    color: #62ff62;
  }
`
