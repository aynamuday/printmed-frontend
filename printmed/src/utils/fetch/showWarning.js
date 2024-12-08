import { globalSwalWithIcon } from "../globalSwal"

export const showWarning = (message) => {
    globalSwalWithIcon.fire({
        icon: 'warning',
        title: `${message}`,
        showConfirmButton: false,
        showCloseButton: true
    })
}