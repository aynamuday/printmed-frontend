import Swal from "sweetalert2"

export const showLoggedOut = () => {
    Swal.fire({
        customClass: {
          title: 'text-xl font-bold text-black text-center',
          confirmButton: 'text-white rounded-lg px-6 py-2 hover:bg-blue-700',
          cancelButton: 'bg-gray-700 border-2 rounded-lg px-6 py-2',
          popup: 'border-2 rounded-xl pt-4 px-2 pb-7 w-[400px]'
        },
        title: "You have been logged out.",
        html: `<p style="color: black; font-size: 17px; margin: 0;">Please log back in.</p>`,
        showConfirmButton: false,
        showCloseButton: true,
    })
}