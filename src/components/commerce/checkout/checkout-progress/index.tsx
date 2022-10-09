import styled from '@emotion/styled'
import { useCart } from '../../../../context';
import { useCheckout } from '../../../../hooks';
import checkout from '../../../../pages/checkout';


const Step = styled.div`
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
    background: #f0fcfa;
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
      background: #f0fcfa;
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
    background: #fff;
  }

  &.valid {
    background: #e2f9f5;
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
      background: #e2f9f5;
    }
  }
`;

const StepArrow = styled.i`
  width: 15px;
  height: 15px;
  border: 2px solid #32557f;
  border-left: 0;
  border-top: 0;
  transform: rotate(318deg);
`;

const CheckoutProgress = () => {
  const {setCheckoutStep, cart} = useCart()
  console.log("CheckoutProgresscart", cart)
  return (
    <div className="w-full lg:max-w-287px grid grid-cols-3 items-center border border-gray-170 rounded-lg overflow-hidden">
      <Step
        className={
          checkout?.currentCheckoutStep == "CHECKOUT"
            ? "active cursor-pointer"
            : "valid cursor-pointer"
        }
        onClick={() =>
          updateCheckout({ ...checkout, currentCheckoutStep: "CHECKOUT" })
        }
      >
        <span className="z-5">Checkout</span>
        <span className="arrow border-r border-t border-gray-170"></span>
      </Step>

      <Step
        className={`${
          checkout?.currentCheckoutStep == "SHIPPING" ? "active" : ""
        } ${
          checkout?.currentCheckoutStep == "PAYMENT"
            ? "valid cursor-pointer"
            : ""
        }`}
        onClick={() => {
          if (checkout?.currentCheckoutStep == "PAYMENT") {
            updateCheckout({ ...checkout, currentCheckoutStep: "SHIPPING" });
          }
        }}
      >
        <span className="z-5">Shipping</span>
        <span className="arrow border-r border-t border-gray-170"></span>
      </Step>

      <Step
        className={checkout?.currentCheckoutStep == "PAYMENT" ? "active" : ""}
        // onClick={() =>
        //   updateCheckout({ ...checkout, currentCheckoutStep: "PAYMENT" })
        // }
      >
        <span className="z-5">Payment</span>
        <span className="arrow"></span>
      </Step>
    </div>
  );
};

export default CheckoutProgress;
