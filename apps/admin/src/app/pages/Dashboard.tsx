import { useNavigate } from 'react-router-dom';
import { Dashboard as DashboardScreen } from '../components/screens/Dashboard';

export default function Dashboard() {
  const navigate = useNavigate();
  return <DashboardScreen onNavigate={navigate} />;
}
