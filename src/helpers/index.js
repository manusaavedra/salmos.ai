export function clearButtons(currentCheckbox) {
    const buttons = document.getElementsByName('note')
    buttons.forEach(button => {
        if (currentCheckbox !== button)
            button.checked = false
    })
}

export function stringFormatted(miliseconds) {

    miliseconds = Number(miliseconds).toFixed(0)
    let minute = padLeft(Math.floor((miliseconds / 60) % 60));
    let second = padLeft((miliseconds % 60).toFixed(0));

    return `${minute}:${second}`

}


export function padLeft(number) {
    return String(number).padStart(2, 0)
}