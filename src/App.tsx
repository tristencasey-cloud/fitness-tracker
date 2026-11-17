import { Navigate, Route, Routes } from 'react-router'
import { AppShell } from './components/AppShell/AppShell'
import { HistoryScreen } from './screens/HistoryScreen'
import { RoutinesScreen } from './screens/RoutinesScreen'
import { SettingsScreen } from './screens/SettingsScreen'
import { TodayScreen } from './screens/TodayScreen'

export function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<TodayScreen />} />
        <Route path="routines" element={<RoutinesScreen />} />
        <Route path="history" element={<HistoryScreen />} />
        <Route path="settings" element={<SettingsScreen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
