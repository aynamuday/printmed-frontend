import Swal from "sweetalert2";

const globalSwalNoIcon = Swal.mixin({
    customClass: {
        title: 'text-xl font-bold text-black text-center',
        confirmButton: 'text-white rounded-lg px-6 py-2 hover:bg-blue-700',
        cancelButton: 'bg-gray-700 border-2 rounded-lg px-6 py-2',
        popup: 'border-2 rounded-xl p-4 pb-7'
    },
    confirmButtonColor: "#248176",
    cancelButtonColor: "#b33c39",
})

export default globalSwalNoIcon