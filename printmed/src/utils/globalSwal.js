import Swal from "sweetalert2";

export const globalSwalNoIcon = Swal.mixin({
    customClass: {
        title: 'text-xl font-bold text-black text-center',
        confirmButton: 'text-white rounded-lg px-6 py-2 hover:bg-blue-700',
        cancelButton: 'bg-gray-700 border-2 rounded-lg px-6 py-2',
        popup: 'border-2 rounded-xl p-4 pb-7'
    },
    confirmButtonColor: "#248176",
    cancelButtonColor: "#b33c39",
})

export const globalSwalWithIcon = Swal.mixin({
    customClass: {
        title: 'text-xl font-bold text-black text-center',
        popup: 'border-2 rounded-xl px-4 py-8',
        icon: 'p-0 mx-auto my-0',
        confirmButton: 'text-white rounded-lg px-6 py-2 hover:bg-blue-700',
        cancelButton: 'bg-gray-700 border-2 rounded-lg px-6 py-2'
    },
    confirmButtonColor: "#248176",
    cancelButtonColor: "#b33c39",
})