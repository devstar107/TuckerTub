/* eslint-disable no-constant-condition */
/* eslint-disable no-nested-ternary */
/* eslint-disable tailwindcss/no-custom-classname */
import styled from '@emotion/styled'

import { useCart } from '~/context'

const StyledStep = styled.div`
  text-align: center;
  color: #525252;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 9px 12px;
  padding-right: 0;
  margin-right: 12px;
  position: relative;

  &:last-child {
    span.arrow {
      right: -4px;
    }
  }

  &:nth-child(2) {
    z-index: 3;
  }

  &:nth-child(1) {
    z-index: 6;
  }

  &.active {
    background-color: #f0fcfa;
    color: RGB(44, 102, 110);

    span.arrow {
      width: 200px;
      height: 200px;
      transform: rotate(45deg) skew(10deg, 10deg);
      position: absolute;
      right: -4px;
      border-top-right-radius: 2px;
      top: -79px;
      bottom: 0;
      display: block;
      background-color: #f0fcfa;
    }
  }

  span.arrow {
    width: 200px;
    height: 200px;
    transform: rotate(45deg) skew(10deg, 10deg);
    position: absolute;
    right: -4px;
    border-top-right-radius: 2px;
    top: -79px;
    bottom: 0;
    display: block;
    background-color: #fff;
  }

  &.valid {
    background-color: #e2f9f5;
    color: RGB(44, 102, 110);
    span.arrow {
      width: 200px;
      height: 200px;
      transform: rotate(45deg) skew(10deg, 10deg);
      position: absolute;
      right: -4px;
      border-top-right-radius: 2px;
      top: -79px;
      bottom: 0;
      display: block;
      background-color: #e2f9f5;
    }
  }
`

interface Step {
  id: number
  name: string
  value: number
}

const steps: Step[] = [
  { id: 1, name: 'Details', value: 1 },
  { id: 2, name: 'Shipping', value: 2 },
  { id: 3, name: 'Payment', value: 3 }
]

interface StepProps {
  step: Step
  index: number
}

function Step(props: StepProps) {
  const { step, index } = props
  const { currentCheckoutStep } = useCart()

  console.log('currentCheckoutStep', currentCheckoutStep)

  const isCurrent = currentCheckoutStep === index + 1
  const isUpcoming = currentCheckoutStep < index + 1
  const isCompleted = currentCheckoutStep > index + 1

  const currentClass = isCurrent
    ? 'active'
    : isUpcoming
    ? 'upcoming'
      ? isCompleted
        ? 'completed'
        : ''
      : ''
    : ''

  return (
    <StyledStep className={currentClass} aria-current={isCurrent ? 'step' : undefined}>
      <span className="text-sm font-medium text-gray-900">{step.name}</span>
      {index !== steps.length - 1 ? (
        <span className="arrow border-r border-t border-gray-200" />
      ) : (
        <span className="arrow" />
      )}
    </StyledStep>
  )
}
export default function Stepssssssss() {
  const { setCheckoutStep, currentCheckoutStep } = useCart()

  return (
    <nav aria-label="Progress">
      <button
        type="button"
        onClick={() => {
          if (currentCheckoutStep === 3) {
            return setCheckoutStep(1)
          }
          setCheckoutStep(currentCheckoutStep + 1)
        }}
      >
        increment step
      </button>
      <ol className="grid w-full grid-cols-3 items-center overflow-hidden rounded-lg border border-gray-200">
        {steps.map((step, index) => {
          console.log('Step', step)

          return (
            <li key={step.id}>
              <Step step={step} index={index} />
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
