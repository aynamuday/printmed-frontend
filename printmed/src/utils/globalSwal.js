import Swal from "sweetalert2";

const globalSwal = Swal.mixin({
    customClass: {
        title: 'text-xl font-bold text-black text-center',
        confirmButton: 'bg-[#248176] text-white rounded-lg px-6 py-2 hover:bg-blue-700',
        cancelButton: 'bg-gray-700 border-2 rounded-lg px-6 py-2',
        popup: 'border-2 rounded-xl pb-10 pt-6'
    }
})

export default globalSwal