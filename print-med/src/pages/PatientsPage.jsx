import Header from "../components/Header"
import Sidebar from "../components/Sidebar"
import Cards from "../components/Cards"
import PatientRecord from "../components/PatientRecord"

const PatientsPage = () => {
  return (
    <div>
        <Sidebar />
        <Header />
        <PatientRecord />
    </div>
  )
}

export default PatientsPage
