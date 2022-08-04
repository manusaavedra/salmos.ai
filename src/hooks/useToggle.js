import { useState } from "react";

export default function useToggle(inititialValue = false) {
    const [isToggled, setToggle] = useState(inititialValue)
    const toggle = () => setToggle(!isToggled)
    return {isToggled, toggle}
}