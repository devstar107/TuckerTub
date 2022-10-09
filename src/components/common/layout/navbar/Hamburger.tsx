/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/no-use-before-define */

import styled from '@emotion/styled'

import { useGlobalState } from '~/context'

/**
 * Renders the hamburger.
 *
 * @returns {JSX.Element} - The HTML Markup.
 */
export const Hamburger = () => {
  const { toggleNav, navbarOpen } = useGlobalState()

  return (
    <HamburgerStyles
      id="navbar-hamburger-button"
      className="relative h-inherit w-[10vh] cursor-pointer"
      onClick={toggleNav}
      navbarOpen={navbarOpen}
    >
      <span id="start-span" className="hamburger-span" />
      <span id="end-span" className="hamburger-span" />
    </HamburgerStyles>
  )
}

const HamburgerStyles = styled.div`
  &:hover {
    span#start-span {
      transform: ${props => {
        return props.navbarOpen
          ? 'translate(-50%, -50%) rotate(135deg)'
          : 'translate(-50%, -50%) rotate(0)'
      }};
    }

    span#end-span {
      transform: ${props => {
        return props.navbarOpen
          ? 'translate(-50%, -50%) rotate(45deg)'
          : 'translate(-50%, -50%) rotate(0)'
      }};
    }
  }

  span#start-span {
    top: ${props => {
      return props.navbarOpen ? '50%' : '30%'
    }};
    left: ${props => {
      return props.navbarOpen ? '50%' : '50%'
    }};
    transform: ${props => {
      return props.navbarOpen
        ? 'translate(-50%, -50%) rotate(45deg)'
        : 'translate(-50%, -50%) rotate(0)'
    }};
  }

  span#end-span {
    top: ${props => {
      return props.navbarOpen ? '50%' : '70%'
    }};
    left: ${props => {
      return props.navbarOpen ? '50%' : '50%'
    }};
    transform: ${props => {
      return props.navbarOpen
        ? 'translate(-50%, -50%) rotate(-45deg)'
        : 'translate(-50%, -50%) rotate(0)'
    }};
  }
`
