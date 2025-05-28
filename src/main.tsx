import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import LoginPage from './page/auth/login'
import RegisterPage from './page/auth/register'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      {/* <App />
       */}
      {/* <LoginPage /> */}
      <RegisterPage />
    </Provider>
  </StrictMode>,
)
