import { AuthTester } from '../../components/AuthTester'
import { ImportData } from '../../components/admin/ImportData/ImportData'

export default function AdminPage() {
  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: '40px 24px' }}>
      <AuthTester />
      <ImportData />
    </div>
  )
}
