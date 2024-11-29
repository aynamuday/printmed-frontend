import { globalSwalWithIcon } from "../globalSwal"

export const showError = (err) => {
    console.log(err)
    let error = err.message ?? "Something went wrong. Please try again later."

    if (err.name === "TypeError") {
        error = "Something went wrong. Please try again later. You may refresh or check your Internet connection."
    }
    
    globalSwalWithIcon.fire({
        icon: 'error',
        title: `${error}`,
        showConfirmButton: false,
        showCloseButton: true
    })
}