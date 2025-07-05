import { FC, lazy, ReactElement } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { PATHS } from '@utils/paths'

const Rules = lazy(() => import('@routes/Rules'))
const Users = lazy(() => import('@routes/Users'))

export const RouterConfig: FC = (): ReactElement => {
  return (
    <Router>
      <Routes>
        <Route path={PATHS.ROOT} element={<Users />} />
        <Route path={PATHS.RULES} element={<Rules />} />
        <Route path={PATHS.USERS} element={<Users />} />
      </Routes>
    </Router>
  )
}
