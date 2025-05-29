import { Outlet, Link } from 'react-router';

const PublicLayout = () => {
  return (
    <>
      <h1>Public Layout</h1>
      <Outlet /> 
    </>
  )
}

export default PublicLayout
