import React, { useContext, useState } from 'react'
import { Container, Form } from 'react-bootstrap'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import { NavLink, useLocation, useHistory } from 'react-router-dom'
import { LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE } from '../utils/consts'
import { registration } from '../http/userAPI'
import { observer } from 'mobx-react-lite'
import { Context } from '../index'
import { handleLogin } from '../utils/handleLogin'

const Auth = observer(() => {
  const { user, basket } = useContext(Context)
  const location = useLocation()
  const history = useHistory()
  const isLogin = location.pathname === LOGIN_ROUTE
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const click = async () => {
    try {
      if (isLogin) {
        await handleLogin(email, password, user, basket)
      } else {
        const decodedToken = await registration(email, password, basket)
        user.setUser(decodedToken)
        user.setIsAuth(true)
      }
      // user.setUser(user)
      // user.setIsAuth(true)
      history.push(SHOP_ROUTE)
    } catch (e) {
      if (e.response && e.response.data && e.response.data.message) {
        alert(e.response.data.message)
      } else {
        alert('Произошла ошибка. Попробуйте позже.')
        console.error(e)
      }
    }
  }

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ height: window.innerHeight - 54 }}
    >
      <Card style={{ width: 600 }} className="p-5">
        <h2 className="m-auto">{isLogin ? 'Авторизация' : 'Регистрация'}</h2>
        <Form className="d-flex flex-column">
          <Form.Control
            className="mt-3"
            placeholder="Введите ваш email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Form.Control
            className="mt-3"
            placeholder="Введите ваш пароль..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
          <Row className="d-flex justify-content-between mt-3 pl-3 pr-3">
            {isLogin ? (
              <div>
                Нет аккаунта?{' '}
                <NavLink to={REGISTRATION_ROUTE}>Зарегистрируйся!</NavLink>
              </div>
            ) : (
              <div>
                Есть аккаунт? <NavLink to={LOGIN_ROUTE}>Войдите!</NavLink>
              </div>
            )}
            <Button variant={'outline-success'} onClick={click}>
              {isLogin ? 'Войти' : 'Регистрация'}
            </Button>
          </Row>
        </Form>
      </Card>
    </Container>
  )
})

export default Auth
