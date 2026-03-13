import { Outlet } from 'react-router-dom';
import Layout from '../components/Dashboard/Layout';

export default function Dashboard() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
