import Header from "../components/Header"
import Sidebar from "../components/Sidebar"
import Cards from "../components/Cards"
import PatientRecord from "../components/PatientRecord"

const PatientRecordsPage = () => {
  return (
    <div>
        <Sidebar />
        <Header />
        <PatientRecord />
    </div>
  )
}

export default PatientRecordsPage
